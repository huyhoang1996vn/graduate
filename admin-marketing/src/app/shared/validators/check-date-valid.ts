export class CheckDateValid {
    
    /*
        Function trimDate(): get day, month, year
        Author: Lam
    */
    trimDate(string){
        let index_first = string.indexOf("/");
        let index_last = string.lastIndexOf("/");
        let d = parseInt(string.substring(0, index_first));
        let m = parseInt(string.substring(index_first+1, string.indexOf("/", index_first+1)));
        let y = parseInt(string.substring(index_last+1));
        return this.isValid(d,m,y);
    }

    /*
        Function daysInMonth(): get day in month
        Author: Lam
    */
    daysInMonth(m, y) {
        switch (m) {
            case 2 :
                return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
            case 9 : case 4 : case 6 : case 11 :
                return 30;
            default :
                return 31
        }
    }

    /*
        Function isValid(): check valid
        Author: Lam
    */
    isValid(d, m, y) {
        return m >= 1 && m <= 12 && d > 0 && d <= this.daysInMonth(m, y);
    }
}   