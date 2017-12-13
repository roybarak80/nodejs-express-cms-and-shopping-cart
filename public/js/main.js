$(function(){

if($('textarea#ta').length){
    CKEDITOR.replace('ta');
}
    $('a.confirmDelete').on('click',function(){
        if(!confirm('confirm Delete')){
            return false;
        }
    });
});