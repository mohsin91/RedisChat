"use strict";
exports.__esModule = true;
var SocketIO = require("socket.io");
// import { IMessage, IMessageViewModel } from '../model/Message';
// import { ChatRequest, ChatRequestViewModel, HeartBeatViewModel, UserViewModel } from '../model/ChatRequest';
// import { MessageSendingType, MessageStatusType, MessageDeliveryType } from '../helper/enumerations';
// import * as moment from 'moment';
var constants_1 = require("../helper/constants");
// import { func } from '../../node_modules/@types/joi';
// import { HttpRequest } from '../helper/request';
// import * as Configs from "../configurations";
var _pub = require('redis-connection')();
var _sub = require('redis-connection')('subscriber');
var handleError = require('hapi-error').handleError;
//  const SocketIO = require("socket.io");
var _io;
var ConnectionList = [];
function init(listener, callback) {
    // setup redis pub/sub independently of any socket.io connections
    _pub.on('ready', function () {
        // console.log("PUB Ready!");
        _sub.on('ready', function () {
            _sub.subscribe('chat:messages:latest', 'chat:people:new');
            // now start the socket.io
            _io = SocketIO.listen(listener);
            _io.on('connection', chatHandler);
            // Here's where all Redis messages get relayed to Socket.io clients
            _sub.on('message', function (channel, message) {
                // console.log(channel + ' : ' + message);
                _io.emit(channel, message); // relay to all connected socket.io clients
            });
            return setTimeout(function () {
                return callback();
            }, 300); // wait for socket to boot
        });
    });
}
function chatHandler(socket) {
    // welcome new clients
    socket.emit('io:welcome', 'hi!');
    socket.on('io:name', function (name) {
        _pub.hset('people', socket.client.conn.id, name);
        // console.log(socket.client.conn.id + " > " + name + ' joined chat!');
        _pub.publish('chat:people:new', name);
    });
    socket.on('io:message', function (msg) {
        // console.log('msg:', msg);
        var sanitised_message = sanitise(msg);
        var str;
        _pub.hget('people', socket.client.conn.id, function (error, name) {
            // see: https://github.com/dwyl/hapi-error#handleerror-everywhere
            handleError(error, 'Error retrieving '
                + socket.client.conn.id + ' from Redis :-( for: ' + sanitised_message);
            // console.log("io:message received: " + msg + " | from: " + name);
            str = JSON.stringify({
                m: sanitised_message,
                t: new Date().getTime(),
                n: name
            });
            _pub.rpush('chat:messages', str); // chat history
            _pub.publish('chat:messages:latest', str); // latest message
        });
    });
    /* istanbul ignore next */
    socket.on('error', function (error) {
        handleError(error, error.stack);
    });
    // how should we TEST socket.io error? (suggestions please!)
    socket.on('disconnect', function () {
        UserStatus(socket, true);
        //console.log(socket.id);
    });
}
function UserStatus(socket, isOffline) {
    ConnectionList = [];
    for (var i in socket.server.sockets.connected) {
        if (socket.server.sockets.connected.hasOwnProperty(i)) {
            var s = socket.server.sockets.connected[i];
            var connect = ConnectionList.find(function (x) { return x.handshake.query.user_id === s.handshake.query.user_id; });
            if (!connect) {
                ConnectionList.push(s);
            }
        }
    }
    //Socket Managements HeartBeat
    var connectedSocket = null;
    if (ConnectionList.length > 0) {
        connectedSocket = ConnectionList.find(function (x) { return x.handshake.query.user_id === socket.handshake.query.user_id; });
    }
    if (connectedSocket) {
        ConnectionList = ConnectionList.filter(function (el) { return socket.handshake.query.user_id !== el.handshake.query.user_id; });
        if (isOffline) {
            // ConnectionList.pop(socket);
        }
        else {
            ConnectionList.push(socket);
        }
    }
    else {
        if (!isOffline) {
            ConnectionList.push(socket);
        }
    }
    var onlineUserList = [];
    ConnectionList.forEach(function (connection) {
        if (connection.handshake && connection.handshake.query.user_id !== undefined) {
            onlineUserList.push({ userId: connection.handshake.query.user_id, onlineStatus: true });
        }
    });
    // if (onlineUserList && onlineUserList.length > 0) {
    socket.server.sockets.emit(constants_1.ConstantVariable._heartBeatLiveUser, onlineUserList);
    //  }
}
// please see: .
function sanitise(text) {
    var sanitised_text = text;
    /* istanbul ignore else */
    if (text.indexOf('<') > -1 /* istanbul ignore next */
        || text.indexOf('>') > -1) {
        sanitised_text = text.replace(/</g, '&lt').replace(/>/g, '&gt');
    }
    return sanitised_text;
}
/**
 * chat is our Public interface
 * @param {object} listener [required] - the http/hapi server object.
 * @param {function} callback - called once the socket server is running.
 * @returns {function} - returns the callback after 300ms (ample boot time)
 */
module.exports = {
    init: init,
    pub: _pub,
    sub: _sub
};
