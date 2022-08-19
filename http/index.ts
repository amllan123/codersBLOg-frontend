import axios from 'axios';

const api=axios.create({
baseURL:process.env.API_URL,
headers:{
    Authorization:`Bearer 912b1c53c2e272390af0368cdaf2653e163e368d9cbe21ee3eef284350365f34416534743688598b15683e9b8f8292c8413e55614d11a762a98c7a4ea7b69b7846d5d069e55505fa242e9e4dfb5041fbe2175966fa4692babcf81888aae7085d7ba470ea6086c4c9b311eaa3811e29a314e456217c4e2b4aa196cf86a62fa792`
}

 
});

//category fetching
export const fetchCategories = async()=>api.get('/api/categories');

//article list fetching
 export const fetcArticles=async(queryString:string)=>api.get(`/api/articles?${queryString}`);

 //individual article fetch
 export const fetchArticle=async(queryString:string)=>api.get(`/api/articles?${queryString}`);