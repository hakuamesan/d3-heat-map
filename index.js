let dataset = [];
let length =0;

let h = 500;
let w = 1000;          
let padding = 70;

let plotData = [];
let colors = ["blue", "white", "black", "gray"]
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let baseTemp = 0;
let years = [];
let variance = [];

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then( (data)=> { // get all data, do checks etc

  baseTemp = data.baseTemperature;
  dataset = [...data.monthlyVariance];
  years = dataset.map( (d) => d.year);
  variance = dataset.map( (d) => d.variance );
  varMonth = dataset.map( (d) => d.month);

  console.log("data len=" + dataset.length);
})
.then( (d) => { // plot the map


let svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height",h);




let minYr = (d3.min(years));
let maxYr = (d3.max(years));
console.log("MinYr=" + minYr + " maxYr=" + maxYr);

let minVar = (d3.min(variance));
let maxVar = (d3.max(variance));
console.log("MinVar=" + minVar + " maxVar=" + maxVar);



///  Draw Axis and scale
let xScale = d3.scaleLinear()
              .domain([minYr, maxYr])
              .range([padding, w-padding])

let yScale = d3.scaleBand()
               .domain(months)
               .range([h-padding, padding])

let xAxis = d3.axisBottom(xScale)
              .tickFormat(d3.format("d"))

let yAxis = d3.axisLeft(yScale)


svg.append("g")
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .call(xAxis)

svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding  + ",0)")
    .call(yAxis)


let myColors = d3.scaleLinear()
.range(colors)
.domain([minVar, maxVar])





var tooltip = d3.select('#main')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

let cellh = (h-padding)/12;

svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("class","cell")
.attr("x", (d,i) => xScale(d.year))
.attr("y", (d,i) => {console.log(yScale(months[d.month-1])); return yScale(months[d.month-1])-5; })
.attr("width", w / (maxYr-minYr))
.attr("height", cellh)
.style("fill", (d,i) => myColors(variance[i]))
.attr("data-month", (d,i) => d.month-1)
.attr("data-year", (d,i) => d.year)
.attr("data-temp", (d,i) => baseTemp+d.variance)
.on("mouseover", (d,i) => {
	tooltip.transition()
		    .duration(20)
    		.style("opacity", 1)
    tooltip.html( months[d.month-1] + " " + d.year + "<br> Temp:" + (baseTemp + d.variance).toFixed(2) )
            .attr("data-year", d.year)
			.style("left", d3.event.pageX - 50 + 'px')
			.style("top", d3.event.pageY - 20 + 'px')
			.style("transform", "translateX(60px)");
			})
.on("mouseout", (d,i) => {
	tooltip.transition()
    		.duration(100)
	    	.style("opacity",0)
            .attr("data-year","")
});





// add legend
 var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (h/2 - i * 20) + ")";
    });

  legend.append("rect")
    .attr("x", w-18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d,i) => colors[i]);

  legend.append("text")
    .attr("x", w- 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")







})


