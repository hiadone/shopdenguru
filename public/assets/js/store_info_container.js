        //addPadding
        var elStoreInfoContainer = document.querySelector('.store_info_container');
        var elStoreItemListContainer = document.querySelector('.store_item_list_container');

        function addPadding(){
            var containerPadding = elStoreInfoContainer.clientHeight + 16;

            elStoreItemListContainer.style.marginTop = containerPadding + 'px';
        }
        addPadding();
        window.addEventListener('resize',function(){
            addPadding();
        });

        //
