import { useBoolean } from '@literal-ui/hooks'
import { ReadonlyDeep } from 'type-fest'
import { useSnapshot } from 'valtio'

import { ISection } from '@ink/reader/models'

import { reader } from '../Reader'
import { Row } from '../Row'

import { View, ViewProps } from './View'

export const ImageView: React.FC<ViewProps> = (props) => {
  const { focusedTab } = useSnapshot(reader)

  return (
    <View {...props}>
      <div className="scroll">
        {focusedTab?.sections?.map((s) => (
          <Block section={s} />
        ))}
      </div>
    </View>
  )
}

interface BlockProps {
  section: ReadonlyDeep<ISection>
}
const Block: React.FC<BlockProps> = ({ section }) => {
  const { focusedTab } = useSnapshot(reader)
  const [expanded, toggle] = useBoolean(false)

  const resources = focusedTab?.epub.resources
  // @ts-ignore
  const blobs = resources?.replacementUrls
  // @ts-ignore
  const assets = resources?.assets as []

  if (!resources || !section.images.length) return null

  return (
    <div>
      <Row badge expanded={expanded} toggle={toggle} subitems={section.images}>
        {section.navitem?.label}
      </Row>

      {expanded && (
        <div className="select-none">
          {section.images.map((src) => {
            const i = assets.findIndex((a: any) => src.includes(a.href))
            const asset = assets[i] as any
            const blob = blobs[i]

            if (!blob) return null
            return (
              <img
                className="w-full cursor-pointer px-5 py-2"
                key={i}
                src={blob}
                alt={asset.href}
                onClick={() => {
                  const img = section?.document.querySelector(
                    `img[src*="${asset.href}"]`,
                  )

                  if (img) {
                    reader.focusedTab?.rendition?.display(
                      section?.cfiFromElement(img),
                    )
                  }
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
