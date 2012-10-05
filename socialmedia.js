/*
Benjamin Choi (bengyenc)
Timothy Koh (tkoh1)
Nicky Ong (junyouo)
*/

function getSearch(keyword){
    getFb(keyword);
    getTweets(keyword);
    getBlog(keyword);
}

function getFb(keyword){
var str= keyword;

var fbquery = "https://graph.facebook.com/search?q={"+
    str+
    "}&type=post";
String.prototype.linkify=function(){
              return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&;\?\/.=]+/g,function(m){
                return m.link(m);
              });
            }

$.getJSON(fbquery, function(data){
    
    var counter=0;
    $("#outputFb").empty();
    $(data['data']).each(function(i,v){                      
        if (counter<6){                                       //counter counts the no. of comments already added
             var userid=this.from.id;
        
        if (this.message===undefined){}
        else{
             var message = this.message.linkify();
            }
            var userpic="https://graph.facebook.com/"
                +userid+
                "/picture/";
            var useridurl="https://facebook.com/"
                +userid;
               if (this.message && this.message.length<300 && this.message.length>100){
             
             var fbUpdate='<div class="tweet"><div class="tweet-left"><a target="_blank" href="'+useridurl+'"><img width="48" height="48" alt="'+useridurl+' on FB" src="'+userpic+'" /></a></div><div class="tweet-right"><p class="text">'+message+'</p></div><br style="clear: both;" /></div>';
             

             $("#outputFb").append(fbUpdate);
             counter+=1;
                }                
                    
               }           
        })
    });

}


function getTweets(keyword){

    var searchterm = keyword;
    String.prototype.linkify=function(){
              return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&;\?\/.=]+/g,function(m){
                return m.link(m);
              });
            }
    
    var url= "http://search.twitter.com/search.json?q="+
        searchterm + 
        "&rpp=4&callback=?";
    $.getJSON( url, function( data ) {
      $("#outputTwitter").empty();
      var counter=0;
        $(data.results).each(function(i,v){
          if (counter<5){
            this.text = this.text.linkify();
            var tweet='<div class="tweet"><div class="tweet-left"><a target="_blank" href="http://twitter.com/'+this.from_user+'"><img width="48" height="48" alt="'+this.from_user+' on Twitter" src="'+this.profile_image_url+'" /></a></div><div class="tweet-right"><p class="text">'+this.text+'</p></div><br style="clear: both;" /></div>';
            counter+=1;
            $("#outputTwitter").append(tweet);
             }       
        });
    });
}



// Restrict results by URL. 

// This code generates a "Raw Searcher" to handle search queries. The Raw Searcher requires
// you to handle and draw the search results manually.
google.load('search', '1');

var blogSearch;

function searchComplete() {
  // Check that we got results
  if (blogSearch.results && blogSearch.results.length > 0) {
    for (var i = 0; i < blogSearch.results.length; i++) {

      // Create HTML elements for search results
      
      var link = blogSearch.results[i].postUrl;
      link = link.slice(0, -1);
      var title = blogSearch.results[i].title;
      var snippet=blogSearch.results[i].content;
  

      var blogSearchResults='<div class="each"><a href="'+link+'">'+title+'</a></div>'; 
     
      //var blogSearchResults=<a target="_blank" href='link'><p class="text">title</p></a>;
      
      $("#outputBlog").append(blogSearchResults);
    }
  }
}

function getBlog(keyword) {
  $("#outputBlog").empty();
  var SearchTerm= keyword;

  // Create a BlogSearch instance.
  blogSearch = new google.search.BlogSearch();

  // Set searchComplete as the callback function when a search is complete.  The
  // blogSearch object will have results in it.
  blogSearch.setSearchCompleteCallback(this, searchComplete, null);
  
  // Add a search query
   blogSearch.setResultSetSize(5)

  // Execute search query
  blogSearch.execute(SearchTerm);

 
}

/*
function preventDuplicate(){        //if duplicate then we do not add it to updates

}
*/
