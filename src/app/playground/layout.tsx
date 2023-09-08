import PlaygoundNav from "../components/PlaygroundNav";


export default function PlaygoundLayout({
    children,
}:{
    children: React.ReactNode
}) {
    return(
        <section>
            {/**Shared Playgound Nav Here*/}
           <PlaygoundNav />
            {children}
        </section>
    )
}