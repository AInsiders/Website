// Futuristic Animated Text JavaScript - Non-Interactive
var Town = document.getElementById('Town');
var Letters = null;

function buildFuturisticText() {
  // Get the hero title
  var heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  
  // Move the hero title into the Town container
  Town.appendChild(heroTitle);
  
  // Get all letter spans
  Letters = document.querySelectorAll('.hero-title span');
  
  // Add hologram elements to each letter
  Letters.forEach(function(letter, index) {
    // Add hologram overlay
    var hologram = document.createElement('div');
    hologram.className = 'hologram';
    letter.appendChild(hologram);
    
    // Set staggered animation delay
    letter.style.animationDelay = (index * 0.1) + 's';
    
    // Add circuit connection points
    var circuitNode = document.createElement('div');
    circuitNode.className = 'circuit-node';
    circuitNode.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: #00ffff;
      border-radius: 50%;
      box-shadow: 0 0 5px #00ffff;
      animation: nodeGlow 2s ease-in-out infinite;
      animation-delay: ${index * 0.2}s;
    `;
    
    // Position circuit nodes at corners
    var positions = [
      { top: '10%', left: '10%' },
      { top: '10%', right: '10%' },
      { bottom: '10%', left: '10%' },
      { bottom: '10%', right: '10%' }
    ];
    
    positions.forEach(function(pos, posIndex) {
      var node = circuitNode.cloneNode(true);
      Object.assign(node.style, pos);
      node.style.animationDelay = (index * 0.2 + posIndex * 0.1) + 's';
      letter.appendChild(node);
    });
  });
}

// Add CSS for circuit nodes
function addCircuitStyles() {
  var style = document.createElement('style');
  style.textContent = `
    @keyframes nodeGlow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.5);
      }
    }
    
    .circuit-node {
      pointer-events: none;
      z-index: 4;
    }
  `;
  document.head.appendChild(style);
}

// Initialize the futuristic text when the page loads
document.addEventListener('DOMContentLoaded', function() {
  if (Town) {
    addCircuitStyles();
    buildFuturisticText();
  }
});

// Also initialize when the page transition system reveals content
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the page transition system to reveal content
  setTimeout(function() {
    if (Town && !Letters) {
      addCircuitStyles();
      buildFuturisticText();
    }
  }, 2000);
}); 