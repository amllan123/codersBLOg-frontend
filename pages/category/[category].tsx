import React from 'react'
import Head from 'next/head';
import Tab from '../../components/Tab';
import { GetServerSideProps } from 'next';
import {AxiosResponse} from 'axios'
import {ICollectionResponse,ICategory,IArticles,IQueryOption, IPagination} from '../../types/index'
import { fetchCategories,fetcArticles } from "../http";
import ArticleList from '../../components/ArticleList';
import Pagination from '../../components/Pagination';
import  qs from 'qs';
import {useRouter} from 'next/router';
import { debounce } from '../../utils/index'
interface IPropType{
  categories:{
    items:ICategory[];
  }
  articles:{
    items:IArticles[]
    pagination:IPagination
  }
}


function category ({categories,articles}:IPropType) {
  const {page,pageCount}=articles.pagination
  const router=useRouter();
  const {category:categoryslug}=router.query

  const handlesearch=(query:string)=>{
    router.push(`/category/${categoryslug}/?search=${query}`)
  }
  return (
    <>
      <Head>
        <title className=' text-primary'>CodersBlog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
    <Tab categories={categories.items} handleOnsearch={debounce(handlesearch,500)}/>
    <ArticleList articles={articles.items} />
    <Pagination page={page} pageCount={pageCount} reDirectUrl={`/category/${categoryslug}`}/ >
  
    </>
 )
}

export const getServerSideProps:GetServerSideProps=async({query})=>{
  console.log("query",query);
  
const options:Partial<IQueryOption>={
      populate:['author.avtar'],
      sort:['id:desc'],
      filters:{
        category:{
          slug:query.category
        },
    }
,    pagination:{
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






  const {data:categories}:AxiosResponse<ICollectionResponse<ICategory[]>>=await fetchCategories();

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


export default category;