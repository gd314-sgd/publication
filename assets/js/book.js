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



// -------------------------

// Toggle guides

// -------------------------

function toggleCropMarks(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_cropmarks")) {
    document.documentElement.classList.remove("_cropmarks");
  }
  else {
    document.documentElement.classList.add("_cropmarks");
  }
}


// Trying to get started 
let linksAsFootnotes = Bindery.Footnote({
  selector: 'p > a',
  render: (element, number) => `${number}: Link to ${element.href}`;
});

let runningHeaders = Bindery.RunningHeader({
  render: (page) => page.isLeft
    ? `${page.number} · Jan Tschichold`
    : `The Form of the Book · ${page.number}`;
});

Bindery.makeBook({
  content: {
    selector: '#book'
    url: '/book.html',
  },
  rules: [ linksAsFootnotes, runningHeaders ]
});
