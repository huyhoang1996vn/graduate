declare var window:any;

/* 
    Function: Customize dataTable
    @author: Trangle
*/ 
export let data_config = function(record) {
    return {
        record: record,
        order: [ 1, 'desc'],
        language: {
            sSearch: '',
            searchPlaceholder: ' Nhập thông tin tìm kiếm',
            lengthMenu: `Hiển thị _MENU_ ${record}`,
            info: `Hiển thị _START_ tới _END_ của _TOTAL_ ${record}`,
            paginate: {
                "first":      "Đầu",
                "last":       "Cuối",
                "next":       "Sau",
                "previous":   "Trước"
            },
            select: {
                rows: ''
            },
            sInfoFiltered: "",
            zeroRecords: `Không có ${record} nào để hiển thị`,
            infoEmpty: ""
        },
        responsive: true,
        pagingType: "full_numbers",
        search: {
            smart: false
        }
    };
}
/*
    Function: Custmize Order DataTable
        Relplace the default string, html sorting with that offered bt the Intl API
        Overwriting the default asc, desc methods sorting DataTable
    @author: Diemnguyen
 */
export let datatable_custom_order = function ( locales ) {
    if ( window.Intl ) {
        var collator = new window.Intl.Collator( locales );
        let types:any = $.fn.dataTable.ext.type;
        // Delete 'string-pre' formmater function the DataTablse
        delete types.order['string-pre'];
        // Delete 'html-pre' formmater function the DataTablse
        delete types.order['html-pre'];

        // Overwriting string-asc, stribg-desc
        // Check a, b exist
        types.order['string-asc'] = function ( a, b ) {  
            // Fix bug sort empty data with not empty data
            a = (a != '-Infinity' && a!= '') ? a.replace( /<.*?>/g, "" ).toLowerCase(): '';
            b = (b != '-Infinity' && b!= '') ? b.replace( /<.*?>/g, "" ).toLowerCase(): '';
            return collator.compare( a, b ) * 1;
        };
        types.order['string-desc'] = function ( a, b ) {
            // Fix bug sort empty data with not empty data
            a = (a != '-Infinity' && a!= '') ? a.replace( /<.*?>/g, "" ).toLowerCase(): '';
            b = (b != '-Infinity' && b!= '') ? b.replace( /<.*?>/g, "" ).toLowerCase(): '';
            return collator.compare( a, b ) * -1;
        };
    }
};