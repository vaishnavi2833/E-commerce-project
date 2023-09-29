class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        const keyword=this.queryString.keyword?{
            name:{
                $regex:this.queryString.keyword, //Regex, short for "regular expression," is a powerful and flexible pattern-matching language used for searching, matching, and manipulating text.
                $options: 'i' //for making it case insensitive
            }
        }:{}

        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){

    }
}

module.exports = APIFeatures