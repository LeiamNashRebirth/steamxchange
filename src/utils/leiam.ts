import { Leiam } from '@/env/secrets';

export const getContent = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/content/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getInfo = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/info/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getVideo = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/watch/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getSearch = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/search/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};