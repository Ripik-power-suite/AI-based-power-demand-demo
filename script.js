var chartOptions1 = {
  legend: {
    display: false,
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    },
  },
  scales: {
  	yAxes: [{
  		display: false,
  		ticks: {
  			beginAtZero: true
  		}  		
  	}]
  },
};

var chartOptions2 = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    },
  },
  scales: {
  	yAxes: [{
  		ticks: {
  			beginAtZero: true
  		}
  	}]
  },
};

function makeVolumeGraph(volume) {
	str = "Volume consumed"
	chart1 = new Chart(document.getElementById("chart1"), {
	  type: 'bar',
	  data: {
	    datasets: [{
	      type: 'bar',
	      label: 'Power consumed (no of units)',
	      data: [volume1, volume2, volume],
	      fill: false,
	      backgroundColor: "#0075FF"
	    }],
	    labels: ["A", "B", "C"]
	  },
	  options: chartOptions1
	});	
}

function makeCostGraph(cost) {
	str = "Total Spend"
	chart3 = new Chart(document.getElementById("chart3"), {
	  type: 'bar',
	  data: {
	    datasets: [{
	      type: 'bar',
	      label: 'Total Spend (in Rs.)',
	      data: [costScenario1.toFixed(2), costScenario2.toFixed(2), cost.toFixed(2)],
	      backgroundColor: "green"
	    }],
	    labels: ["A", "B", "C"]
	  },
	  options: chartOptions1
	});	
}

function makeSpendGraph(cost, volume) {
	str = "Per Unit Cost"
	chart2 = new Chart(document.getElementById("chart2"), {
	  type: 'bar',
	  data: {
	    datasets: [{
	      type: 'line',
	      label: 'Spend per unit (in Rupees)',
	      data: [(costScenario1/volume1).toFixed(2), (costScenario2/volume2).toFixed(2), (cost/volume).toFixed(2)],
	      fill: true,
	      borderColor: "red",
	    }],
	    labels: ["A", "B", "C"]
	  },
	  options: chartOptions1
	});	
}

function getCircle1(cost, volume) {
	var elem = document.getElementById("circle1");
	elem.style.display = "block";
	if(cost > costScenario1){
		elem.style.borderColor = "rgb(128,0,0)";
		elem.style.color = "rgb(128,0,0)";
		elem.style.backgroundColor = "rgba(128,0,0,0.3)"
	} else {
		elem.style.borderColor = "green";
		elem.style.color = "green";		
		elem.style.backgroundColor = "rgba(0,128,0,0.3)"
	}
	elem.innerHTML = "<h2>"+(100*(costScenario1-cost)/costScenario1).toFixed(2)+"%</h2><p>Savings wrt Scenario 1</p>";
}

function hideCircle1() {
	document.getElementById("circle1").style.display = "none";
}

function evaluateScenario(scenario) {
	var cost = 0;
	var volume = 0;
	for(var i=0; i<6; i++) {
		if(required[i]<scenario[i]){
			cost += iex[i]*scenario[i];
		}else{
			cost += iex[i]*scenario[i]+grid[i]*(required[i]-scenario[i]);
		}
		volume += scenario[i];
	}
	return [cost, volume];
}

function onSubmit() {
	if(document.getElementById("btn").innerHTML == "Retry"){
		document.getElementById("btn").innerHTML = "Submit";
		chart1.destroy();
		chart2.destroy();
		chart3.destroy();
		makeSliders();
	} else {
		var lst = [0,0,0,0,0,0];
		var elems = ["0h","4h","8h","12h","16h","20h"];
		for(var i = 0; i<6; i++){
		    var temp = document.getElementById(elems[i]).value;
		    lst[i] = temp*1;
		}
		var [cost, volume] = evaluateScenario(lst);

		makeVolumeGraph(volume);
		makeSpendGraph(cost,volume);
		makeCostGraph(cost);

		var lst = ["0h", "4h", "8h", "12h", "16h", "20h"];
		for(var i=0; i<6; i++){
			document.getElementById(lst[i]+"fix").style.visibility = "visible";
			getCircle1(cost, volume);
			document.getElementById("btn").innerHTML = "Retry";
		}
		document.getElementById("vol").style.display = "block";
		document.getElementById("spend").style.display = "block";
		document.getElementById("avgSpend").style.display = "block";
		document.getElementById("legend").style.display = "block";
		document.getElementById("alert").style.display = "none";
	}
}

function makeSliders() {
	document.getElementById("btn").innerHTML = "Submit";
	if(document.getElementById("scenario1").checked){
		lst = ["0h", "4h", "8h", "12h", "16h", "20h"];
		for(var i=0; i<6; i++){
			document.getElementById(lst[i]).value = scenario1[i];
			document.getElementById(lst[i]).disabled = true;
			document.getElementById(lst[i]+"fix").style.visibility = "visible";
			document.getElementById("btn").style.display = "none";
		}
		onSubmit();
		hideCircle1();
	}
	if(document.getElementById("scenario2").checked){
		lst = ["0h", "4h", "8h", "12h", "16h", "20h"];
		for(var i=0; i<6; i++){
			document.getElementById(lst[i]).value = scenario2[i];
			document.getElementById(lst[i]).disabled = true;
			document.getElementById(lst[i]+"fix").style.visibility = "visible";
			document.getElementById("btn").style.display = "none";
		}
		onSubmit();
		getCircle1(costScenario2, volume2);
	}
	if(document.getElementById("scenario3").checked){
		lst = ["0h", "4h", "8h", "12h", "16h", "20h"];

		chart1.destroy();
		chart3.destroy();
		chart2.destroy();

		for(var i=0; i<6; i++){
			document.getElementById(lst[i]).value = 50;
			document.getElementById(lst[i]).disabled = false;
			document.getElementById(lst[i]+"fix").style.visibility = "hidden";
			document.getElementById("btn").style.display = "block";
		}

		document.getElementById("vol").style.display = "none";
		document.getElementById("spend").style.display = "none";
		document.getElementById("avgSpend").style.display = "none";
		document.getElementById("legend").style.display = "none";
		document.getElementById("alert").style.display = "block";

		document.getElementById("btn").innerHTML = "Submit";
		hideCircle1();
	}
}

var iex = [5.8, 6.3, 7.0, 6.1, 6.4, 5.9];
var grid = [7.5,7.5,7.5,7.5,7.5,7.5];

var required = [75, 85, 70, 73, 78, 80];

var scenario1 = [49, 59, 80, 84, 63, 55];
var scenario2 = [54, 72, 65, 70, 80, 72];

var [costScenario1, volume1] = evaluateScenario(scenario1);
var [costScenario2, volume2] = evaluateScenario(scenario2);

var lineCanvas = document.getElementById("powerCost");
var chart1 = null
var chart2 = null
var chart3 = null

var lineChart = new Chart(lineCanvas, {
  type: 'bar',
  data: {
    datasets: [{
      type: 'line',
      label: 'IEX Cost (Rs per unit)',
      data: iex,
      lineTension: 0,
      borderColor: 'green',
      fill: false,
    }, {
      type: 'line',
      label: 'Grid Cost (Rs per unit)',
      data: grid,
      lineTension: 0,
      borderColor: 'red',
      fill: false,
    }],
    labels: ["0-4h", "4-8h", "8-12h", "12-16h", "16-20h", "20-24h"]
  },
  options: chartOptions2
});

document.getElementById("0hfix").disabled=true;
document.getElementById("4hfix").disabled=true;
document.getElementById("8hfix").disabled=true;
document.getElementById("12hfix").disabled=true;
document.getElementById("16hfix").disabled=true;
document.getElementById("20hfix").disabled=true;

makeSliders();