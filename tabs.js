$(function () {
    var tabs = [];
    var tabContainers = [];
    $('ul.tabs a').each(function () {
      // note that this only compares the pathname, not the entire url
      // which actually may be required for a more terse solution.
        if (this.pathname == window.location.pathname) {
            tabs.push(this);
            tabContainers.push($(this.hash).get(0));
        }
    });
    
    $(tabs).click(function () {
        // hide all tabs
        $(tabContainers).hide().filter(this.hash).show();
        
        // set up the selected class
        $(tabs).removeClass('selected');
        $(this).addClass('selected');
        
        return false;
    });
});


<div class="tabs">
  <!-- tabs -->
  <ul class="tabNavigation">
    <li><a href="#message">Send a message</a></li>
    <li><a href="#shareFile">Share a file</a></li>
    <li><a href="#arrange">Arrange a meetup</a></li>
  </ul>

  <!-- tab containers -->
  <div id="message">
    <p>Lorem ipsum dolor sit amet.</p>
  </div>
  <div id="shareFile">
    <p>Sed do eiusmod tempor incididunt.</p>
  </div>
  <div id="arrange">
    <p>Ut enim ad minim veniam</p>
  </div>
</div>