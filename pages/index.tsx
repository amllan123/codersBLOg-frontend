import { Axios, AxiosResponse } from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { fetcArticles, fetchCategories } from './http'
import { ICollectionResponse, IPagination } from '../types'
import { ICategory } from '../types'
import { IArticles ,IQueryOption } from '../types'
import Tab from '../components/Tab'
import ArticleList from '../components/ArticleList'
import qs from 'qs'
import Pagination from '../components/Pagination'
import { useRouter } from 'next/router'
import { debounce } from '../utils'
interface IPropType{
  categories:{
    items:ICategory[]
  }
  articles:{
    items:IArticles[];
    pagination:IPagination
  }
}



const Home: NextPage<IPropType> = ({categories,articles}) => {

 const {page,pageCount}=articles.pagination
 const router=useRouter();
 const handleserach=(query:string)=>{
     router.push(`/?search=${query}`)
   
 }


  return (
    <div>
      <Head>
        <title className=' text-primary'>CodersBlog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

          {/* {categories.items.map(category=>{

            return category.attributes.Slug
          })} */}

          {/* cztegory fetching
           */}

      <Tab categories={categories.items}  handleOnsearch={debounce(handleserach,500)}/>

      {/* Article fetching */}

      {/* {articles.articleitem.map(a=>{

        return a.attributes.Title;
      })} */}

      <ArticleList articles={articles.items} />
      <Pagination page={page} pageCount={pageCount} reDirectUrl={'/'}/ >

        
        
      
    </div>
  )
}



export const getServerSideProps:GetServerSideProps=async({query})=>{
    const options:Partial<IQueryOption>={
      populate:['author.avtar'],
      sort:['id:desc'],
      pagination:{
        page:query.page?+query.page:1,
        pageSize:6

      }

    }

    if(query.search){

      options.filters={
        Title:{
          $containsi:query.search
        }

      }
    }

    const queryString=qs.stringify(options);
  
    
 
    
  //articles
  const{data:articles}:AxiosResponse<ICollectionResponse<IArticles[]>>=await fetcArticles(queryString);

  



 //category fetch

 const {data:categories,}:AxiosResponse<ICollectionResponse<ICategory[]>>=await fetchCategories();

  
 
 return{
    props:{
  categories:{
    items:categories.data
  },
  articles:{
items:articles.data,
pagination:articles.meta.pagination

  }
    }
  }
}

export default Home
