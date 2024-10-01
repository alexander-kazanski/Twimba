import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

if (!localStorage.getItem("tweetsData")) {
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}

function getTweetsData() {
    return JSON.parse(localStorage.getItem("tweetsData"));
}

document.addEventListener('click', function(e){
    if (e.target.dataset.close) {
        handleDeleteTweet(e.target.dataset.close);
    }
    else if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    } else if (e.target.dataset.tweetReply) {
        handelTweetReply(e.target.dataset.tweetReply);
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleDeleteTweet(tweetId) {
    let tweetsData = getTweetsData();
    tweetsData = tweetsData.filter(function(tweet) {
        return tweet.uuid !== tweetId;
    })
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    render()
}
 
function handleLikeClick(tweetId){ 
    const tweetsData = getTweetsData()
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    render()
    
}

function handelTweetReply(tweetId) {
    const tweetReply = document.getElementById(`input-reply-${tweetId}`);
    const tweetsData = getTweetsData()
    const currentTweet = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0]
    
    currentTweet.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: tweetReply.value,
    });
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    render()
    tweetReply.value = "";
    handleReplyClick(tweetId);
}

function handleRetweetClick(tweetId){
    const tweetsData = getTweetsData();
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        const tweetsData = getTweetsData()
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    getTweetsData().forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `<div class="reply-container"><input type="text" id="input-reply-${tweet.uuid}" class="input-reply" placeholder="Post your reply"><button type="button" data-tweet-reply="${tweet.uuid}" class="reply-btn">Reply</button></div>`
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="close"><i data-close="${tweet.uuid}" class="fa-solid fa-x"></i></div>
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

