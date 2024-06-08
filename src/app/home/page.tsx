import { NavBar, TitleBanner, SearchBar } from './components';

export default function Page() {
    return (
    <section>
        <NavBar />
        <div className="flex my-10 justify-center">
        <TitleBanner />
        </div>
        <p className="flex p-10 text-lg font-bold justify-center">A comprehensive collection of the worlds beyond our own.</p>
        <SearchBar />
    </section> 
    )
}