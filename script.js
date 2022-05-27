main();
document.getElementById("size").addEventListener("change", function() {
	main();
});
stopwatch();
window.addEventListener("load", sw.init);

lboard = [];

function main()
{	
	score = 0;
	document.getElementById("score").innerHTML = score;
	modal();
	
	n = document.getElementById("size").value;
	drawTable();
	
	const A = [];
	for (let i = 0; i < (n*n); i++)
	{
		A[i] = i;
		td(i).addEventListener("click", tdClick);
	}
	arr = shuffleArray(A);
	arrsel = [];
	
	ptr = 0;
	cptr = -1;
}

function drawTable()
{
	document.getElementById("game").remove();
	let T = document.createElement("TABLE");
	T.setAttribute("id", "game");
	document.body.append(T);
	
	for (let i = 0; i < n; i++)
	{
		let row = document.createElement("TR");
		T.appendChild(row);
		row.setAttribute("id", "r"+i);
		
		for (let j = 0; j < n; j++)
		{
			let col = document.createElement("TD");
			document.getElementById("r"+i).append(col);
			let num = (n * i) + j;
			col.setAttribute("id", "c"+num);
			col.innerHTML = "<br>&emsp;&emsp;&nbsp;<br>";
		}
	}
}

function check(array, id)
{
	for (let i = 0; i <= ptr; i++)
		if (("c" + array[i]) == id)
			return true;
	return false;
}

function tdClick()
{
	let audio = new Audio('sound.mp3');
	audio.play();
	
	if (!check(arr, this.id))
	{
		let R = document.getElementById("result");
		R.style.color = "red";
		R.innerHTML = "Wrong Box Clicked. Game Over.";
		let E = document.createElement("h3");
		document.getElementById("scores").append(E);
		E.innerHTML = score + " in " + document.getElementById("sw-time").innerHTML;
		document.getElementById("leaderboard").style.display = "block";
		sw.reset(true);
	}
	
	else if (!check(arrsel, this.id))
	{
		let str = this.id.substring(1);
		let num = parseInt(str);
		arrsel[++cptr] = num;
	}
	
	if (cptr == ptr)
	{
		document.getElementById("score").innerHTML = ++score;
		
		if (ptr == ((n*n)-1))
		{
			lboard.push(score);
			let R = document.getElementById("result");
			R.style.color = "green";
			R.innerHTML = "Congrats ! You have won !";
			
			let E = document.createElement("h3");
			document.getElementById("scores").append(E);
			E.innerHTML = score + " in " + document.getElementById("sw-time").innerHTML;
			document.getElementById("leaderboard").style.display = "block";
			
			sw.reset(true);
		}
		
		else
		{
			cycle(0, arr, ++ptr);
			arrsel = [];
			cptr = -1;
		}
	}
}

function td(i)
{
	return document.getElementById("c" + i);
}

function cycle(i, arr, ptr)
{
	if (i > ptr) return;
	animation(td(arr[i]));
	setTimeout(function() { cycle(i+1, arr, ptr); }, 1000);
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--)
	{
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function full(arr)
{
	for (let i = 0; i < ((n*n)-1); i++)
		if (arr[i] == 0) return false;
	return true;
}

function animation(obj)
{
	obj.setAttribute("class", "animClass");
	setTimeout(function() {
		obj.removeAttribute("class");
	}, 1000);
}

function modal()
{
	let M = document.getElementById("leaderboard");
	let C = document.getElementById("close");
	
	C.onclick = function() {
		M.style.display = "none";
		main();
	};
}

function stopwatch()
{
	sw = {
  // (A) PROPERTIES
  etime : null, // html time display
  erst : null, // html reset button
  ego : null, // html start/stop button
  timer : null, // timer object
  now : 0, // current elapsed time
  
  // (B) INITIALIZE
init : () => {
  // (B1) GET HTML ELEMENTS
  sw.etime = document.getElementById("sw-time");
  sw.erst = document.getElementById("sw-rst");
  sw.ego = document.getElementById("sw-go");
 
  // (B2) ENABLE BUTTON CONTROLS
  sw.erst.onclick = sw.reset;
  sw.ego.onclick = sw.start;
  sw.erst.disabled = false;
  sw.ego.disabled = false;
},


// (C) START!
start : () => {
	for (let i = 0; i < (n*n); i++)
	{
		document.getElementById("c" + i).removeAttribute("style");
	}
	
	cycle(0, arr, ptr);
  sw.timer = setInterval(sw.tick, 1000);
  sw.ego.value = "Stop";
  sw.ego.onclick = sw.stop;
},
 
// (D) STOP
stop : () => {
	
	for (let i = 0; i < (n*n); i++)
	{
		document.getElementById("c" + i).setAttribute("style", "pointer-events: none");
	}
	
  clearInterval(sw.timer);
  sw.timer = null;
  sw.ego.value = "Start";
  sw.ego.onclick = sw.start;
},

// (E) TIMER ACTION
tick : () => {
  // (E1) CALCULATE HOURS, MINS, SECONDS
  sw.now++;
  let hours = 0, mins = 0, secs = 0,
  remain = sw.now;
  hours = Math.floor(remain / 3600);
  remain -= hours * 3600;
  mins = Math.floor(remain / 60);
  remain -= mins * 60;
  secs = remain;
 
  // (E2) UPDATE THE DISPLAY TIMER
  if (hours<10) { hours = "0" + hours; }
  if (mins<10) { mins = "0" + mins; }
  if (secs<10) { secs = "0" + secs; }
  sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
},

// (F) RESET
reset : (x) => {
	
	if (!x)
	{
	lboard.push(score);
			let R = document.getElementById("result");
			R.style.color = "blue";
			R.innerHTML = "Game Terminated";
			
			let E = document.createElement("h3");
			document.getElementById("scores").append(E);
			E.innerHTML = score + " in " + document.getElementById("sw-time").innerHTML;
			document.getElementById("leaderboard").style.display = "block";
	}
  if (sw.timer != null) { sw.stop(); }
  sw.now = -1;
  sw.tick();
}

};
}