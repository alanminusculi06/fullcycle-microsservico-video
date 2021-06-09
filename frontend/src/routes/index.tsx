import { RouteProps } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoriesPageList from "../pages/category/PageList";
import GenresPageList from "../pages/genre/PageList";
import CastMembersPageList from "../pages/cast-members/PageList";
import CategoryPageForm from "../pages/category/PageForm";
import CastMemberPageForm from "../pages/cast-members/PageForm";
import GenrePageForm from "../pages/genre/PageForm";


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
        label: 'Categorias',
        path: '/categories',
        component: CategoriesPageList,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar categoria',
        path: '/categories/new',
        component: CategoryPageForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar categoria',
        path: '/categories/:id/edit',
        component: CategoryPageForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Gêneros',
        path: '/genres',
        component: GenresPageList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gênero',
        path: '/genres/new',
        component: GenrePageForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar gênero',
        path: '/genres/:id/edit',
        component: GenrePageForm,
        exact: true
    },
    {
        name: 'cast-members.list',
        label: 'Pessoas',
        path: '/cast-members',
        component: CastMembersPageList,
        exact: true
    },
    {
        name: 'cast-members.create',
        label: 'Criar pessoa',
        path: '/cast-members/new',
        component: CastMemberPageForm,
        exact: true
    },
    {
        name: 'cast-members.edit',
        label: 'Editar pessoa',
        path: '/cast-members/:id/edit',
        component: CastMemberPageForm,
        exact: true
    }
];

export default routes;