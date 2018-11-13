"use strict";
exports.__esModule = true;
require('dotenv').load();
//Services Contents
var ConstantVariable = /** @class */ (function () {
    function ConstantVariable() {
    }
    ConstantVariable.AgentLoginServiceCall = "/api/web/agent/login";
    ConstantVariable.UserLoginServiceCall = "/api/web/user/login";
    //Global Variables
    ConstantVariable._agentAcceptChannel = process.env.AppName + ":" + "Admin:Accept:Subscribe:Channel:Agent:";
    ConstantVariable._agentAcceptChannelOpponent = process.env.AppName + ":" + "Admin:Accept:Subscribe:Channel:User:";
    ConstantVariable._userOneToOneAcceptChannel = process.env.AppName + ":" + "Chat:Listing:Subscribe:Channel:User:";
    ConstantVariable._agentRequestChannel = process.env.AppName + ":" + "Admin:Request:Subscribe:Channel";
    ConstantVariable._agentChatChannel = ":" + process.env.AppName + ":agent";
    ConstantVariable._userChatChannel = ":" + process.env.AppName + "121:";
    ConstantVariable._requestChannel = "requestsubscribe:channel:";
    ConstantVariable._heartBeatListner = "HeartBeat:" + process.env.AppName + ":";
    ConstantVariable._heartBeatLiveUser = "HeartBeat:" + process.env.AppName;
    return ConstantVariable;
}());
exports.ConstantVariable = ConstantVariable;
