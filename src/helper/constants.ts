require('dotenv').load();
//Services Contents
export class ConstantVariable {
    public static AgentLoginServiceCall:string = "/api/web/agent/login";
    public static UserLoginServiceCall:string = "/api/web/user/login";
    //Global Variables
    public static  _agentAcceptChannel:string = process.env.AppName + ":" + "Admin:Accept:Subscribe:Channel:Agent:" ;
    public static  _agentAcceptChannelOpponent:string = process.env.AppName + ":" + "Admin:Accept:Subscribe:Channel:User:";
    public static  _userOneToOneAcceptChannel:string = process.env.AppName + ":" + "Chat:Listing:Subscribe:Channel:User:";
    public static  _agentRequestChannel:string = process.env.AppName + ":" + "Admin:Request:Subscribe:Channel";
    public static  _agentChatChannel:string = ":" + process.env.AppName + ":agent";
    public static  _userChatChannel:string = ":" + process.env.AppName + "121:";
    public static  _requestChannel:string = "requestsubscribe:channel:";
    public static  _heartBeatListner:string = "HeartBeat:" + process.env.AppName + ":";
    public static  _heartBeatLiveUser:string = "HeartBeat:" + process.env.AppName ;
}



