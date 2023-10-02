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
        const queryCopy={...this.queryString};
        //Removing fields from the query
        const removeFields=['keyword','limit','page']
        removeFields.forEach(el=>delete queryCopy[el]);

        //Advance filter for price, ratings etc
        let queryString=JSON.stringify(queryCopy);
        queryString=queryString.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`); //gt=greater than, gte=greater than equal to, lt=less than, lte=less than equal to
        // console.log(queryString);
        // console.log(JSON.parse(queryString));
        this.query=this.query.find(JSON.parse(queryString));
        return this;
    }

    pagination(resultsPerPage){
        const currentPage=Number(this.queryString.page) || 1;
        const skip=resultsPerPage*(currentPage-1);
        this.query=this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures