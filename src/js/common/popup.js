function popup() {
    const popup = {
        open: (type) => {
            let parent = $('.popup')
            let sidebar = parent.find('.popup-sidebar')
    
            parent.addClass('active')
    
            console.log(type);
            switch (type) {
                case 'sidebar' :
                    sidebar.addClass('active')
                    break 
            }
        },
        close: () => {
            let parent = $('.popup')
            let sidebar = parent.find('.popup-sidebar')
    
            parent.removeClass('active')
            sidebar.removeClass('active')
        }
    }
    
    $('[data-popup]').on('click', function(e) {
        e.preventDefault()
        let type = $(this).attr('data-popup')
        popup.open(type)
    })
    
    $('.popup-overlay, [data-popup="close"]').on('click', function(e) {
        e.preventDefault()
        popup.close()
    })
}

export default popup;