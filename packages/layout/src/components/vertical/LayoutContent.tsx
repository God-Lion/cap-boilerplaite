import type { ChildrenType } from '@cap/platform-core'
import { useSettings } from '@cap/platform-core'
import { verticalLayoutClasses } from '../../utils/layoutClasses'
import StyledMain from '../../styles/shared/StyledMain'
import classnames from 'classnames'
import { useLayoutTokens } from '../../hooks/useLayoutTokens'

const LayoutContent = ({ children }: ChildrenType) => {
  const { settings } = useSettings()

  const contentCompact = settings.contentWidth === 'compact'
  const contentWide = settings.contentWidth === 'full'

  const { layoutPadding, compactContentWidth } = useLayoutTokens()

  return (
    <StyledMain
      isContentCompact={contentCompact}
      layoutPadding={layoutPadding}
      compactContentWidth={compactContentWidth}
      className={classnames(
        verticalLayoutClasses.content,
        // 'flex-auto',
        {
          [`${verticalLayoutClasses.contentCompact} is-full`]: contentCompact,
          [verticalLayoutClasses.contentWide]: contentWide,
        },
      )}
      style={{
        flex: '1 1 auto',
        inlineSize: '100%',
      }}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
