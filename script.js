let songs;
let currFolder;

async function getSongs(folder){

    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:5500/spotify/${folder}/`);
    let rep = await a.text();

    // console.log(rep);

    let div = document.createElement("div");
    div.innerHTML = rep;

    // Get all the list items within the ul element
    var listItems = div.getElementsByTagName('li');

    // Initialize an empty array to store anchor tags
     songs = [];

    // Iterate over each list item
    for (var i = 0; i < listItems.length; i++) {
        // Get the anchor tag within the current list item
        var anchor = listItems[i].getElementsByTagName('a')[0];
        
        // Add the anchor tag to the array if it exists
        if (anchor.href.endsWith(".mp3")) {
            songs.push(anchor.href);
        }
    }

    
    let songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    
    songUl.innerHTML = "";

    for (const song of songs) {
        
        let ans = song.replaceAll(`http://127.0.0.1:5500/spotify/${currFolder}/`,"");

        // let modified = ans.replace(/\d+/g, "");
        let removeMp3 = ans.replaceAll(".mp3","");

        songUl.innerHTML = songUl.innerHTML +  `<li>         

                    <i class="fa-solid fa-music"></i>

                    <p>${removeMp3} </p>

                    <div >
                        <p>play now</p>
                        <i class="fa-solid fa-circle-play fa-xl"></i>
                    </div>

             </li>`;

    }

    // attack each song with an event listener
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{

        e.addEventListener("click",(element)=>{

            playMusic(e.querySelector('p').innerHTML.trim());

        })

    })
    
}


function secondsToTime(totalSeconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);
    
    // Format minutes and seconds as strings with leading zeros if necessary
    var minutesString = String(minutes).padStart(2, '0');
    var secondsString = String(seconds).padStart(2, '0');
    
    // Concatenate minutes and seconds with a colon
    var timeString = minutesString + ":" + secondsString;
    
    return timeString;
}

const left_side = document.querySelector(".left");
const hamburger = document.querySelector(".hmburger");
const rmhamburger = document.querySelector(".rmhmburger");

hamburger.addEventListener('click',()=>{

    console.log("add");
    left_side.classList.add("slide");

});
rmhamburger.addEventListener('click',()=>{

    console.log("add");
    left_side.classList.remove("slide");

})

const seek_bar = document.querySelector(".seekbar");

seek_bar.value = 0;
seek_bar.style.backgroundSize = 0+ "% 100%";

let currentSong = new Audio();




const playMusic = (track, pause=false)=>{

    seek_bar.value = 0;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

    if(!track.includes(".mp3")){
        currentSong.src = `http://127.0.0.1:5500/spotify/${currFolder}/`+track +".mp3";
    }
    else{
        currentSong.src = track;
    }

    if(!pause){

        currentSong.play();
        play.innerHTML = "";
        play.innerHTML = `<i class="fa-solid fa-circle-pause fa-xl"></i>`;
    }

    let song = track.replaceAll(`http://127.0.0.1:5500/spotify/${currFolder}/`,"");

    let truncatedSong = song.substring(0, 15);
    if (track.length > 15) {
        truncatedSong += "...";
    }
    // seek_bar.value = 0;
    document.querySelector(".songinfo").innerHTML = `${truncatedSong}`;

}

let play = document.querySelector("#play");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const volume_set = document.querySelector(".volume_range");
volume_set.value = 0;

let cardContainer = document.querySelector(".cardContainer");



async function displayAlbum(){

    let a = await fetch(`http://127.0.0.1:5500/spotify/songs/`);
    let rep = await a.text();

    let div= document.createElement("div")
    div.innerHTML = rep;
    // console.log(div);

    let anchore = div.getElementsByTagName("a");
    // console.log(anchore);

    let array = Array.from(anchore);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs/")){
            let folder =  e.href.split("/").slice(-1)[0];

            let a = await fetch(`http://127.0.0.1:5500/spotify/songs/${folder}/info.json`);
            let rep = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class=" lg:w-[205px] w-full sm:w-[45%] rounded-md p-4 bg-[#1a1a1a] relative group duration-300 hover:bg-[#353535] cursor-pointer card">

            <img src="./songs/${folder}/cover.jpg" alt="" class="object-contain rounded-md">

            <h3 class="font-roboto font-semibold text-sm mt-2 text-[#999ea5]">${rep.title}</h3>

            <p class="font-roboto text-md mt-2">${rep.description}</p>

            <div class="px-6 py-4  bg-green-500 w-9 rounded-full flex justify-center items-center absolute bottom-20 right-4 duration-300 opacity-0 
            group-hover:opacity-100 group-hover:bottom-24 ">
                <i class="fa-solid fa-play text-black"></i>
            </div>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e)=>{

        e.addEventListener("click", async items=>{

            songs = await getSongs(`songs/${items.currentTarget.dataset.folder}`)
        })
    })


}

displayAlbum();




async function main() {

    await getSongs("songs/ncs");

    // console.log(songs);
    playMusic(songs[0] ,true);
    currentSong.volume = parseInt(volume_set.value)/100;
    

    // attach play and pasue on play button
    play.addEventListener("click",()=>{

        if(currentSong.paused){

            currentSong.play();
            play.innerHTML = "";
            play.innerHTML = `<i class="fa-solid fa-circle-pause fa-xl"></i>`;
        }
        else{
            currentSong.pause();
            play.innerHTML = "";
            play.innerHTML = `<i class="fa-solid fa-circle-play fa-xl"></i>`;
        }
        
        
    })

    currentSong.addEventListener("timeupdate",()=>{

        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${secondsToTime(currentSong.currentTime)}/${secondsToTime(currentSong.duration)}`

        seek_bar.value = (currentSong.currentTime/currentSong.duration)*1000;
        seek_bar.style.backgroundSize = (currentSong.currentTime/currentSong.duration)*100 + "% 100%"
    })

    seek_bar.addEventListener("click",(e)=>{

        let percent = (e.offsetX/e.target.getBoundingClientRect().width);
        seek_bar.value = percent*1000;
        seek_bar.style.backgroundSize = percent*100 + "% 100%";

        currentSong.currentTime = ((currentSong.duration)*percent);
    })

    next.addEventListener("click",()=>{
        
        let index = songs.indexOf(currentSong.src);

        if(index+1 < songs.length){
            playMusic(songs[index+1]);
        }

    });

    previous.addEventListener("click",()=>{
        
        let index = songs.indexOf(currentSong.src);

        if(index-1 >= 0){
            playMusic(songs[index-1]);
        }
    });

    volume_set.addEventListener("change",(e)=>{

        currentSong.volume = parseInt(e.target.value)/100;
    });

   


}



main();



















