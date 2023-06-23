import React, { useState } from 'react'

type TagInputProps = {
    tags: string[]
    setTags: (tags: string[]) => void
}

const TagInput = (props: TagInputProps) => {
    const { tags, setTags } = props

    const [newTag, setNewTag] = useState<string>('')

    const addToTags = () => {
        if (!newTag) return
        if (tags.includes(newTag)) return

        setTags([...tags, newTag])
        setNewTag('')
    }

    return (
        <>
            <label htmlFor="newTag">New tag</label>
            <input
                id="newTag"
                type="text"
                placeholder="new tag"
                value={newTag}
                onChange={(e) => {
                    setNewTag(e.target.value)
                }}
            />
            <button type="button" onClick={addToTags}>
                +
            </button>
        </>
    )
}

export default TagInput
