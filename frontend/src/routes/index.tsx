import { RouteProps } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoriesPageList from "../pages/category/PageList";
import GenresPageList from "../pages/genre/PageList";
import CastMembersPageList from "../pages/cast-members/PageList";


export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar categorias',
        path: '/categories',
        component: CategoriesPageList,
        exact: true
    },
    // {
    //     name: 'categories.create',
    //     label: 'Criar categoria',
    //     path: '/categories/new',
    //     component: CategoriesPageList,
    //     exact: true
    // },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenresPageList,
        exact: true
    },
    // {
    //     name: 'genres.create',
    //     label: 'Criar gênero',
    //     path: '/genres/new',
    //     component: GenresPageList,
    //     exact: true
    // },
    {
        name: 'cast-members.list',
        label: 'Listar pessoas',
        path: '/cast-members',
        component: CastMembersPageList,
        exact: true
    },
    // {
    //     name: 'cast-members.create',
    //     label: 'Criar gênero',
    //     path: '/genres/new',
    //     component: CastMembersPageList,
    //     exact: true
    // },
];

export default routes;