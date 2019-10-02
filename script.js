var BOT_LIST = new Set(['angeloflight', 'anotherttvviewer', 'commanderroot', 'hostmeraffle', 'lurxx', 'streamlabs']);

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
  
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
  
    } else if (typeof XDomainRequest != "undefined") {
  
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
  
    } else {
  
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
  
    }
    return xhr;
}

var user_list = new Set();

function difference (setA, setB) {
    var difference = new Set(setA);
    for (var elem of setB) {
      difference.delete(elem);
    }
    return difference;
  }

function add_current_user(cur_users){
    $(current_user).empty();
    var ul = document.getElementById("current_user");
    for (let n_u of cur_users) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(n_u));
        li.setAttribute("class", "list-group-item"); // added line
        ul.appendChild(li);
    }
}
function add_new_user(new_users){
    // $(new_user).empty();
    var ul = document.getElementById("new_user");
    console.log(new_users);
    for (let n_u of new_users) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(n_u));
        li.setAttribute("class", "list-group-item"); // added line
        
        var id = guidGenerator();
        li.setAttribute("id", id);

        ul.appendChild(li);
        $('#' + id).fadeOut(5000, function(){
          this.remove();
        })
    }
}
function get_viewer(){
    var proxy_url = "https://cors-anywhere.herokuapp.com/";
    var user = 'neriioo';
    var url = proxy_url + "https://tmi.twitch.tv/group/user/" + user + "/chatters";
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    
    xhr.onload = function() {
        var responseText = xhr.responseText;
        var json_res = JSON.parse(responseText);

        var current_users = difference(new Set(json_res.chatters.viewers), BOT_LIST);
        
        var new_user = difference(current_users, user_list);
        user_list = current_users;

        add_new_user(new_user);
        add_current_user(user_list);
    };


    xhr.send();
}

function main() {
    setInterval(get_viewer, 1000);
    // get_viewer();
}

$(document).ready(main);