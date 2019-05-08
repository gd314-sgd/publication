
async function getPeers() {
  var archive = new DatArchive('dat://595111fcab584b6dbabe1436f9fd4c1a47f706ee3f29c9848cef7d1c09e69c87/')
  setInterval(function() {
    var archive = new DatArchive('dat://595111fcab584b6dbabe1436f9fd4c1a47f706ee3f29c9848cef7d1c09e69c87/')
  }, 1000);
  var info = await archive.getInfo()
  var peerCount = String(info.peers)
  console.log("peerCount = " + peerCount)

  var peers = await experimental.datPeers.list()

  showPeers(peerCount, peers)
}

if (!window.DatArchive) {
  $('.peers').remove();
}

function showPeers(peerCount, peers) {
  if (peers.length > 1 || peers.length == 0) {
    document.getElementById("peerCount").innerHTML = peerCount + " Peers";
  }
  else if (peers.length == 1) {
    document.getElementById("peerCount").innerHTML = peerCount + " Peer";
  }

  var list = document.getElementById("peerList");

  if (peers.length == 0) {
    var item = document.createElement('li');
    item.appendChild(document.createTextNode('No peers are seeding at the moment.'));
    list.appendChild(item);
  }

  for (var i = 0; i < peers.length; i++) {
    // Create the list item:
    var item = document.createElement('li');
    // Set its contents:
    item.appendChild(document.createTextNode(peers[i].id));
    // Add it to the list:
    list.appendChild(item);
  }
}

getPeers()
