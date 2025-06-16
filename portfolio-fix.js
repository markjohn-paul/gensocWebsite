// Simple Portfolio Loading Fix
$(document).ready(function() {
    
    // Override the portfolio link functionality
    $(document).off('click', 'a.ajax').on('click', 'a.ajax', function() {
        console.log('Portfolio link clicked!');
        
        var url = $(this).attr('href');
        console.log('Loading:', url);
        
        // Navigate to portfolio page first if not already there
        if (window.location.hash.indexOf('portfolio') === -1) {
            window.location.hash = '#/portfolio';
            setTimeout(function() {
                window.location.hash = '#/portfolio/' + url;
            }, 500);
        } else {
            window.location.hash = '#/portfolio/' + url;
        }
        
        return false;
    });
    
    // Simple portfolio loading function
    function loadPortfolioContent(filename) {
        console.log('Loading portfolio content:', filename);
        
        var overlay = $('.p-overlay:not(.active)').first();
        if (overlay.length === 0) {
            console.log('No available overlay found');
            return;
        }
        
        // Show loader
        $('.loader').show();
        
        // Load the content
        $.get(filename)
            .done(function(data) {
                console.log('Content loaded successfully');
                
                var $data = $(data);
                var content = $data.find('.portfolio-single');
                
                if (content.length > 0) {
                    console.log('Found portfolio content, inserting...');
                    
                    overlay.empty().html(content.html());
                    overlay.addClass('portfolio-single container active');
                    
                    // Show the overlay
                    $('html').addClass('p-overlay-on');
                    overlay.show();
                    
                    // Hide loader
                    $('.loader').hide();
                    
                    console.log('Portfolio content displayed successfully!');
                } else {
                    console.log('No .portfolio-single found in loaded content');
                    overlay.html('<div style="padding: 2em; text-align: center;"><h2>Content Error</h2><p>Portfolio content not found in ' + filename + '</p></div>');
                    overlay.addClass('active').show();
                    $('html').addClass('p-overlay-on');
                    $('.loader').hide();
                }
            })
            .fail(function(xhr, status, error) {
                console.log('Failed to load:', status, error);
                overlay.html('<div style="padding: 2em; text-align: center;"><h2>Loading Error</h2><p>Could not load ' + filename + '</p><p>Error: ' + status + '</p></div>');
                overlay.addClass('active').show();
                $('html').addClass('p-overlay-on');
                $('.loader').hide();
            });
    }
    
    // Listen for hash changes
    $(window).on('hashchange', function() {
        var hash = window.location.hash;
        console.log('Hash changed to:', hash);
        
        if (hash.indexOf('/portfolio/') !== -1) {
            var filename = hash.split('/portfolio/')[1];
            if (filename && filename.length > 0) {
                loadPortfolioContent(filename);
            }
        }
    });
    
    // Check on page load
    var currentHash = window.location.hash;
    if (currentHash.indexOf('/portfolio/') !== -1) {
        var filename = currentHash.split('/portfolio/')[1];
        if (filename && filename.length > 0) {
            setTimeout(function() {
                loadPortfolioContent(filename);
            }, 1000);
        }
    }
    
}); 