"use dom"

export default function DOMComponent({ name }: { name: string }) {
    return (
        <div>
            <h1>What's on your mind, {name}?</h1>
        </div>
    )
}