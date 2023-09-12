import PlaygoundNav from "../components/PlaygroundNav";


export default function PlaygoundLayout({
    children,
}:{
    children: React.ReactNode
}) {
    return(
        <section>
            {/**Nav List Items should maybe be dynamic*/}
           <PlaygoundNav />
            {children}
        </section>
    )
}