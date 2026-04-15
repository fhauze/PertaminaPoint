/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/Home.vue'
import ContentPage from '../pages/Home.vue'
import CharacterPage from '../pages/Character.vue'
import RegistePage from '../pages/Register.vue'
import loginPage from '../pages/Login.vue'
import Entertainemnt from '../pages/Entertainment.vue'
import { useAuthStore } from '@/stores/auth';
import MangasPage from '../pages/Mangas.vue'
import ChaptersPage from '@/pages/Chapters.vue'
import ChapterListPage from '@/pages/ChapterList.vue'
import SynopsisPage from '@/pages/Synopsis.vue'
import MissionPage from '@/pages/MissionPage.vue'
import FindwordsPage from '@/pages/Findwords.vue'
import MinigamePage from '@/pages/Minigame.vue'
import FlipcardPage from '@/pages/Flipcard.vue'
import WordspellsPage from '@/pages/Wordspells.vue'
import PointhistoryPage from '@/pages/Pointhistory.vue'
import itemPage from '@/components/itemPage.vue'
import SavePoint from '@/pages/SavePoint.vue'
import {getTokenAuth, errorMessage} from '@/util/utils.js'
import MotorGame from '@/pages/MotorGame.vue'
import CheckIn from '@/pages/CheckIn.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage , meta:{requiresAuth:true}},
  { path: '/content', name: 'content', component: ContentPage, meta:{requiresAuth:true}},
  { path: '/character', name: 'character', component: CharacterPage, meta:{requiresAuth:true}},
  { path: '/register', name: 'register', component: RegistePage,},
  { path: '/login', name:'login', component:loginPage},
  { path: '/entertainment', name:'entertainment', component:Entertainemnt},
  { path: '/entertainment/mangas', name:'mangas', component:MangasPage},
  { path: '/entertainment/manga/:id/chapters', name:'manga', component:ChaptersPage, props:true},
  { path: '/entertainment/manga/:id/chapters/synopsis', name:'manga-sinopsis', component:SynopsisPage, 
     props: route => ({
      id: route.params.id,
      synopsis: route.query.synopsis || ''
    })
  },
  { path: '/entertainment/manga/:manga_id/chapters/:chapter_id/', name:'manga-list', component:ChapterListPage, props:true},
  { path: '/entertainment/manga/:manga_id/chapters/:chapter_id/pages', name:'manga-read', component:ChapterListPage, props:true},
  { path:'/mission/quest/:id/missions', name: 'quest-missions', component:MissionPage},
  { path: '/profile/mission-history', name:'mission-history', component:PointhistoryPage},

  // game
  { path: '/entertainment/game/find-words/', name:'game-find-words', component:FindwordsPage, props:true},
  { path: '/entertainment/mini-games/', name:'mini-games', component:MinigamePage, props:true},
  { path: '/entertainment/mini-games/flipcard/', name:'flipcard', component:FlipcardPage, props:true},
  { path: '/entertainment/mini-games/word-spells/', name:'word-spells', component:WordspellsPage, props:true},
  { path: '/items/', name:'items', component:itemPage, props:true},
  { path: '/entertainment/mini-games/point-save', name: 'point-save', component:SavePoint, props:true},
  { path: '/entertainment/mini-games/moto-game', name: 'moto-game', component:MotorGame, props:true},
  { path: '/mission/checkin', name:'check-in', component:CheckIn, props:true }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async(to, from, next) => {
  const tokenAuth = getTokenAuth();
  const auth = useAuthStore();
  // cek token
  console.log('Origin auth token', tokenAuth)
  if(!tokenAuth || tokenAuth === ''){
    errorMessage('Maaf anda tidak bisa akses karena tidak memiliki token');
  }

  if (!auth.user) {
    const restored = auth.restoreSession();
    if(restored){
       await auth.fetchUser();
    }

    try {
      await auth.fetchUser();
    } catch (e) {
      console.log("Token tidak valid / expired.");
    }
  }
  const isLoggedIn = auth.isLoggedIn;
  
  // const isLoggedIn = auth.isLoggedIn;
  // console.log(isLoggedIn)
  // if(to.meta.requiresAuth && !isLoggedIn) {
  //   return next('/login');
  // }
  if (to.path === '/login' && isLoggedIn) {
    return next('/')
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/login");
  }

  return next();
});

export default router
