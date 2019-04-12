/*jshint laxcomma:true, multistr: true */

// This is the code that defines the design of the book
// and some minor UI of the book-maker, including
// picking which content is included, turning on/off crop
// marks, etc.

// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var togglecrop = document.getElementById("togglecrop");
var regionizer = document.getElementById("regionize");

if (toggler) toggler.addEventListener("click", toggleGuidesAndBleed);
if (togglecrop) togglecrop.addEventListener("click", toggleCropMarks);
if (regionizer) regionizer.addEventListener("click", Bindery.startBind);


// ==================
// React to checkbox

$(".toc [type=checkbox]").change(function (e) {
  var id = this.parentNode.getAttribute("data-toc");
  var elt = document.querySelector('[data-id="' + id + '"]');

  if (!this.checked) {
    this.parentNode.parentNode.classList.add("_wont-print");
    $(elt).nextUntil("[data-id]").andSelf().attr("data-remove-before-print", true);
  }
  else {
    this.parentNode.parentNode.classList.remove("_wont-print");
    $(elt).nextUntil("[data-id]").andSelf().removeAttr("data-remove-before-print");
  }

});
// First lets uncheck them all!
$(".toc [type=checkbox]").attr("checked", false).change();

// -------------------------------------
// Enable UI when we know all images have loaded


// -------------------------------------
//
// R E G I O N I Z E R
//
// Load polyfill when we know all images have loaded


// -------------------------------------

var progbar = document.getElementById("progbar");
var stat = document.getElementById("bindStatus");
var pages = document.querySelectorAll(".page-outer").length;
function reportPagesLeft(p) {
  var done = pages - p;
  stat.innerHTML = "Building page " + done;
  progbar.value = done / pages;
}


stat.innerText = "Loading images...";
imagesLoaded(document.body, function (instance) {
  if (regionizer) {
    regionizer.removeAttribute("disabled");
    stat.innerText = "Ready";
  }
});



// -------------------------

// Toggle guides

// -------------------------

function toggleGuidesAndBleed(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_guides")) {
    document.documentElement.classList.remove("_guides");
  }
  else {
    document.documentElement.classList.add("_guides");
  }
}


function toggleCropMarks(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_cropmarks")) {
    document.documentElement.classList.remove("_cropmarks");
  }
  else {
    document.documentElement.classList.add("_cropmarks");
  }
}


// -------------------------
// Update table of contents

Bindery.afterBind({}, function (pg, state) {

  // If there is an in-page heading
  var heading = pg.querySelector("[data-change-running-head]");
  if (heading) {
    // Add this page to the table of contents
    var id = heading.getAttribute("data-id");
    if (id) {
      var num = pg.parentNode.getAttribute("data-page");
      var tocLine = document.querySelector('.page-inner [data-toc="' + id + '"]');
      if (tocLine) tocLine.innerText = num;
    }
  }
});


