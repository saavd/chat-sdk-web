'use strict';

/* Services */

var DEBUG = false;

var bGroupChatDefaultName = "Private Chat";

//
// Used to load partials
//

//var ccProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");

// Are we testing locally?
var bRootURL = '';
var bPartialURL = '';
var bFirebase = '';

// If we are then set the root URL to nothing
if(document.location.origin === "http://chatcat") {
    bRootURL = '';
    bPartialURL = 'partials/';
    bFirebase = 'chatcatio-test';
}
// Are we testing on the wordpress plugin?
else if(document.location.origin === "http://ccwp") {
    bRootURL = '//chatcat/dist/';
    bPartialURL = bRootURL + 'partials/';
    bFirebase = 'chatcatio-test';
}
// We're live so we need to use the full remote URL
else {
    bRootURL = '//chatcat.firebaseapp.com/';
    bPartialURL = 'https://chatcat.firebaseapp.com/partials/';
    bFirebase = 'chatcat';
}

var bFirebaseRef = '//' + bFirebase + '.firebaseio.com/';

var bImagesURL = bRootURL + 'img/';
var bDefaultProfileImage = bImagesURL + 'cc-100-profile-pic.png';

var bPullURL = "//chat.deluge.co/server/pull.php";
//var bResizeURL = "http://chat.deluge.co/server/tmp/resize.php";

// Paths
var bUsersPath = "users";
var bUsersMetaPath = "usersMeta";
var bRoomsPath = "rooms";
var bPublicRoomsPath = "public-rooms";
var bMessagesPath = 'messages';
var bTypingPath = 'typing';
var bFriendsPath = 'friends';
var bBlockedPath = 'blocked';


var bReadKey = 'read';

var bMetaKey = "meta";
var bImageKey = "image";
var bThumbnailKey = "thumbnail";
var bTimeKey = "time";

var bOnlineKey = "online";

var bUserStatusOwner = 'owner';
var bUserStatusMember = 'member';
var bUserStatusInvited = 'invited';
var bUserStatusClosed = 'closed';

// Tabs
var bUsersTab = 'users';
var bRoomsTab = 'rooms';
var bFriendsTab = 'friends';

var bProfileSettingsBox = 'profileSettingsBox';

var bShowProfileSettingsBox = 'showProfileSettingsBox';
var bShowCreateChatBox = 'showCreateChatBox';

var bVisibilityChangedNotification = 'bVisibilityChangedNotification';


// Chat width
var bChatRoomWidth = 230;
var bChatRoomHeight = 300;

var bChatRoomTopMargin = 60;
var bChatRoomSpacing = 15;

var bMainBoxWidth = 250;
var bMainBoxHeight = 300;

var bRoomListBoxWidth = 200;
var bRoomListBoxHeight = 300;

var bProfileBoxWidth = 300;

var bMinute = 60;
var bHour = bMinute * 60;
var bDay = bHour * 24;

var Paths = {

    cid: null,

    setCID: function (cid) {
        this.cid = cid;
    },

    firebase: function () {
        if(this.cid) {
            return new Firebase(bFirebaseRef + this.cid);
        }
        else {
            return new Firebase(bFirebaseRef);
        }
    },

    usersRef: function () {
        return this.firebase().child(bUsersPath);
    },

    timeRef: function (uid) {
        return this.firebase().child(bTimeKey).child(uid);
    },

    userRef: function (fid) {
        return this.usersRef().child(fid);
    },

    userMetaRef: function (fid) {
        return this.userRef(fid).child(bMetaKey);
    },

    userImageRef: function (fid) {
        return this.userRef(fid).child(bImageKey);
    },

    userThumbnailRef: function (fid) {
        return this.userRef(fid).child(bThumbnailKey);
    },

    userFriendsRef: function (fid) {
        return this.userMetaRef(fid).child(bFriendsPath);
    },

    userBlockedRef: function (fid) {
        return this.userMetaRef(fid).child(bBlockedPath);
    },

    onlineUsersRef: function () {
        return this.firebase().child(bOnlineKey);
    },

    onlineUserRef: function (fid) {
        return this.onlineUsersRef().child(fid);
    },

    roomsRef: function () {
        return this.firebase().child(bRoomsPath);
    },

    publicRoomsRef: function () {
        return this.firebase().child(bPublicRoomsPath);
    },

    publicRoomRef: function (rid) {
        return this.publicRoomsRef().child(rid);
    },

    roomRef: function (fid) {
        return this.roomsRef().child(fid);
    },

    roomMetaRef: function (fid) {
        return this.roomRef(fid).child(bMetaKey);
    },

    roomMessagesRef: function (fid) {
        return this.roomRef(fid).child(bMessagesPath);
    },

    roomUsersRef: function (fid) {
        return this.roomRef(fid).child(bUsersMetaPath);
    },

    roomTypingRef: function (fid) {
        return this.roomMetaRef(fid).child(bTypingPath);
    },

    userRoomsRef: function (fid) {
        return this.userRef(fid).child(bRoomsPath);
    },

    messageUsersRef: function (rid, mid) {
        return this.messageRef(rid, mid).child(bUsersPath);
    },

    messageRef: function (rid, mid) {
        return this.roomMessagesRef(rid).child(mid);
    }
};

function unORNull (object) {
    return object === 'undefined' || object == null;
}

function timeSince (timestamp) {
    if(unORNull(timestamp)) {
        return -1;
    }
    else {
        var date =  new Date(timestamp);
        var time = 0;
        if(!date.now) {
            time = date.getTime();
        }
        else {
            time = date.now();
        }
        return time * 1000;
    }
}