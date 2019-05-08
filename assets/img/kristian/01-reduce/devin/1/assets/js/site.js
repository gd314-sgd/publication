// const userAction = async () => {
//   const response = await fetch('http://example.com/movies.json', {
//     method: 'POST',
//     body: myBody, // string or object
//     headers:{
//       'Content-Type': 'application/json'
//     }
//   });
//   const myJson = await response.json(); //extract JSON from the http response
//   // do something with myJson
// }

var width = 960,
    height = 500;

var options = [
  {name: "Aitoff", projection: d3.geo.aitoff()},
  {name: "Albers", projection: d3.geo.albers().scale(145).parallels([20, 50])},
  {name: "August", projection: d3.geo.august().scale(60)},
  {name: "Baker", projection: d3.geo.baker().scale(100)},
  {name: "Boggs", projection: d3.geo.boggs()},
  {name: "Bonne", projection: d3.geo.bonne().scale(120)},
  {name: "Bromley", projection: d3.geo.bromley()},
  {name: "Collignon", projection: d3.geo.collignon().scale(93)},
  {name: "Craster Parabolic", projection: d3.geo.craster()},
  {name: "Eckert I", projection: d3.geo.eckert1().scale(165)},
  {name: "Eckert II", projection: d3.geo.eckert2().scale(165)},
  {name: "Eckert III", projection: d3.geo.eckert3().scale(180)},
  {name: "Eckert IV", projection: d3.geo.eckert4().scale(180)},
  {name: "Eckert V", projection: d3.geo.eckert5().scale(170)},
  {name: "Eckert VI", projection: d3.geo.eckert6().scale(170)},
  {name: "Eisenlohr", projection: d3.geo.eisenlohr().scale(60)},
  {name: "Equirectangular (Plate Carrée)", projection: d3.geo.equirectangular()},
  {name: "Hammer", projection: d3.geo.hammer().scale(165)},
  {name: "Hill", projection: d3.geo.hill()},
  {name: "Goode Homolosine", projection: d3.geo.homolosine()},
  {name: "Kavrayskiy VII", projection: d3.geo.kavrayskiy7()},
  {name: "Lambert cylindrical equal-area", projection: d3.geo.cylindricalEqualArea()},
  {name: "Lagrange", projection: d3.geo.lagrange().scale(120)},
  {name: "Larrivée", projection: d3.geo.larrivee().scale(95)},
  {name: "Laskowski", projection: d3.geo.laskowski().scale(120)},
  {name: "Loximuthal", projection: d3.geo.loximuthal()},
  // {name: "Mercator", projection: d3.geo.mercator().scale(490 / 2 / Math.PI)},
  {name: "Miller", projection: d3.geo.miller().scale(100)},
  {name: "McBryde–Thomas Flat-Polar Parabolic", projection: d3.geo.mtFlatPolarParabolic()},
  {name: "McBryde–Thomas Flat-Polar Quartic", projection: d3.geo.mtFlatPolarQuartic()},
  {name: "McBryde–Thomas Flat-Polar Sinusoidal", projection: d3.geo.mtFlatPolarSinusoidal()},
  {name: "Mollweide", projection: d3.geo.mollweide().scale(165)},
  {name: "Natural Earth", projection: d3.geo.naturalEarth()},
  {name: "Nell–Hammer", projection: d3.geo.nellHammer()},
  {name: "Polyconic", projection: d3.geo.polyconic().scale(100)},
  {name: "Robinson", projection: d3.geo.robinson()},
  {name: "Sinusoidal", projection: d3.geo.sinusoidal()},
  {name: "Sinu-Mollweide", projection: d3.geo.sinuMollweide()},
  {name: "van der Grinten", projection: d3.geo.vanDerGrinten().scale(75)},
  {name: "van der Grinten IV", projection: d3.geo.vanDerGrinten4().scale(120)},
  {name: "Wagner IV", projection: d3.geo.wagner4()},
  {name: "Wagner VI", projection: d3.geo.wagner6()},
  {name: "Wagner VII", projection: d3.geo.wagner7()},
  {name: "Winkel Tripel", projection: d3.geo.winkel3()}
];

options.forEach(function(o) {
  o.projection.rotate([0, 0]).center([0, 0]);
});

function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

var interval = setInterval(loop, 1500),
    i = 0,
    n = options.length - 1;

var projection = options[i].projection;

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("section.hero").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(responsivefy);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("world-110m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);
});

var menu = d3.select("#projection-menu")
    .on("change", change);

menu.selectAll("option")
    .data(options)
  .enter().append("option")
    .text(function(d) { return d.name; });

function loop() {
  var j = Math.floor(Math.random() * n);
  menu.property("selectedIndex", i = j + (j >= i));
  update(options[i]);
}

function change() {
  clearInterval(interval);
  update(options[this.selectedIndex]);
}

function update(option) {
  svg.selectAll("path").transition()
      .duration(750)
      .attrTween("d", projectionTween(projection, projection = option.projection));
}

function projectionTween(projection0, projection1) {
  return function(d) {
    var t = 0;

    var projection = d3.geo.projection(project)
        .scale(1)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    function project(λ, φ) {
      λ *= 180 / Math.PI, φ *= 180 / Math.PI;
      var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
      return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
    }

    return function(_) {
      t = _;
      return path(d);
    };
  };
}
