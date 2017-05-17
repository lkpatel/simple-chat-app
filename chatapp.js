ChatRooms = new Mongo.Collection('chatrooms')
ChatMsg = new Mongo.Collection('chatmsg')

if(Meteor.isClient){

    Template.registerHelper('extractEmailName', function(email) {
    var emailText = email.substring(0,email.lastIndexOf("@")); //same as truncate.
    return new Spacebars.SafeString(emailText)
    });
    // client code goes here
   Template.chatroom.helpers({
     'chatrooms':function(){
       return ChatRooms.find();
    },
   });

   Template.chatmsg.helpers({
    'chatmsg':function (){
     var chatRoomId = Session.get('chatRoomId'); 
     var chatMessages = ChatMsg.find({chatRoomId:chatRoomId},{sort: {createdAt: -1},limit:20});
     //console.log(chatMessages.fetch());
     return chatMessages;
   }, 
  });

  Template.mychatroom.helpers({
     'mychatroom':function(){
       var chatRoomId = Session.get('chatRoomId'); 
       if(chatRoomId)
         return ChatRooms.findOne({ _id: chatRoomId });
       else
	 return "No chat room selected";
    },
  });
 

  Template.chatroom.events({
  'submit #new-chat-room'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    // Insert a task into the collection
    ChatRooms.insert({
      name:text,
      createdAt: new Date(), // current time
    });
    target.text.value = '';
   },

   //event helper for chat room select
   'click .chatroom': function(){
    console.log("You selected chat room with name "+this.name);
    Session.set('chatRoomId', this._id);
   }
  });
  
  Template.chatmsg.events({
  'submit #new-chat-msg'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    // Insert a task into the collection
    var chatRoomId = Session.get('chatRoomId');
    //console.log(chatRoomId);
    if(chatRoomId){
    var currentUserId = Meteor.userId();
    var currentUserEmail = Meteor.user().emails[0].address;
    ChatMsg.insert({
      msg:text,
      chatRoomId:chatRoomId,
      createdBy:currentUserId,
      createdByEmail:currentUserEmail,
      createdAt: new Date(), // current time
    });
    target.text.value = '';
    }
   else{  
     alert('No chat room selected. Please select a chat room to start a conversation');
     console.log("No chat room selected. Please select a chat room to start a conversation");
     }
   },
  });
  

}

if(Meteor.isServer){
    // server code goes here
}


