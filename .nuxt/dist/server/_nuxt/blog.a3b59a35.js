import { d as defineStore } from "../server.mjs";
const BlogData = [
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "25 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "fashion",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "beauty",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "beauty",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "beauty",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "beauty",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment",
    shortDesc: "you how all this mistaken idea of denouncing pleasure and praising pain was born",
    longDesc: "Consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
  },
  {
    type: "pets",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "pets",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "pets",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "pets",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "bags",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "25 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "bags",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "bags",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "29 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "bags",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "25 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "bags",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "flower",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "flower",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "flower",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "furniture",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "furniture",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "furniture",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "furniture",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "vegetables",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "vegetables",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "vegetables",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "vegetables",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "shoes",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "shoes",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "shoes",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "shoes",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "shoes",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "nursery",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "nursery",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "nursery",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "gym",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "gym",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "gym",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "gym",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "gym",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "marijuana",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "marijuana",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "marijuana",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "watch",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "watch",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "watch",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "watch",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "watch",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  },
  {
    type: "christmas",
    img: "/images/10.jpg",
    link: "/blog/details",
    title: "26 January 2022",
    desc: "Lorem ipsum dolor sit consectetur adipiscing elit",
    date: "by: John Dio , 2 Comment"
  }
];
const useBlogStore = defineStore({
  id: "blog-store",
  state: () => {
    return {
      blog: BlogData,
      bloglist: BlogData
    };
  },
  getters: {
    getblogTag: (state) => {
      const uniqueTag = [];
      const blogTag = [];
      state.bloglist.map((blog, index) => {
        if (blog.tags) {
          blog.tags.map((tag) => {
            const index2 = uniqueTag.indexOf(tag);
            if (index2 === -1)
              uniqueTag.push(tag);
          });
        }
      });
      for (let i = 0; i < uniqueTag.length; i++) {
        blogTag.push(uniqueTag[i]);
      }
      return blogTag;
    }
  },
  actions: {}
});
export {
  useBlogStore as u
};
//# sourceMappingURL=blog.a3b59a35.js.map
