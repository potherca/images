// @TODO: Make directory toggle-able (open/close)

(function($){    
    /* Polyfill for IE<9 for handling negative a index in `substr`
     * 
     * Only run when the substr function is broken
     */
    if ('ab'.substr(-1) != 'b') {
      /**
       *  Get the substring of a string
       *  @param  {integer}  start   where to start the substring
       *  @param  {integer}  length  how many characters to return
       *
       *  @return {string}
       */
        String.prototype.substr = function(substr) {
            return function(start, length) {
            // did we get a negative start, calculate how much it is
            // from the beginning of the string
            if (start < 0) start = this.length + start;
              // call the original function
              return substr.call(this, start, length);
            }
        }(String.prototype.substr);
    }
    
    Array.prototype.contains = function(p_sNeedle) {
        var iCounter = 0;
        for (; iCounter < this.length; iCounter++) {
            if (this[iCounter] === p_sNeedle) {
                return true;
            }
        }
        return false;
    }    
    
    function addFilesToList(p_sPath, p_$List, p_sRootUrl, p_sUser, p_sRepo, p_sToken){
        var sUrl = 'https://api.github.com/repos/'+ p_sUser + '/' + p_sRepo + '/contents/' + p_sPath + (p_sToken?'?access_token=' + p_sToken : '');
        $.ajax({
            dataType: "json",
            url: sUrl,
            success: function(p_oData){
                $.each(p_oData, function(p_i, p_oFile){
                    var $SubList, sFileType, sExtension, sImageUrl;
                    
                    if(typeof p_oFile === 'undefined' || typeof p_oFile.name  === 'undefined' ) {
                        return false;
                    }

                    /* Hide 'dot' files*/
                    if(p_oFile.name.substr(0,1) !== '.'){
                        if(p_oFile.size === null || p_oFile.size === 0 ) {
                            // Directory
                            $SubList = $('<ul></ul>');
                            
                            $Item = $('<li class="folder folder-closed"></li>')
                            
                            $Header = $('<h2>' + p_oFile.name + '</h2>').addClass('toggle-link');
                            $Header.on('click', function(){
                                $(this).parent().toggleClass('folder-closed');
                                $(this).parent().toggleClass('folder-open');
                            });
                            
                            $Item.append($Header);
                            $Item.append($SubList);
                            
                            p_$List.append($Item);
                            
                            addFilesToList(p_oFile.path, $SubList, p_sRootUrl, p_sUser, p_sRepo, p_sToken);
                        } else {
                            sImageUrl = p_sRootUrl + p_sPath + '/' + p_oFile.name;
                            sFileType = 'file';
                            sExtension = p_oFile.name.substr(-4);
                            if(['.gif', '.ico', '.jpg', '.png', '.svg'].contains(sExtension)){
                                p_$List.append(
                                    '<li class="">'
                                    + '<a'
                                    + ' href="' + sImageUrl + '"'
                                    + ' title="' + p_oFile.name.substr(0, p_oFile.name.length-4) + '"'
                                    + '>' 
                                    + '<img src="' + sImageUrl + '">'
                                    + '</a></li>'
                                );
                            }                        
                        }
                    }
                });
            },
            error: function(p_oJqXHR, p_sStatus, p_sError){
                p_$List.append('<li class="error">' + p_sStatus + ': ' + p_sError + '</li>');
            }
        });
    }
    window.addFilesToList = addFilesToList;
}(jQuery));
/*EOF*/
