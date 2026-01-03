import { useTheme } from '@mui/material/styles'
import { useSettings, CustomChip, type Dictionary } from '@cap/platform-core'
import {
  HorizontalNav,
  HorizontalMenu as Menu,
  HorizontalSubMenu as SubMenu,
  HorizontalMenuItem as MenuItem,
  VerticalNavContent,
  useVerticalNav,
  StyledHorizontalNavExpandIcon,
  StyledVerticalNavExpandIcon,
  horizontalMenuItemStyles as menuItemStyles,
  horizontalMenuRootStyles as menuRootStyles,
  verticalNavigationCustomStyles,
  verticalMenuItemStyles,
  verticalMenuSectionStyles,
  type VerticalMenuContextProps,
} from '@cap/layout'
import { ChevronRight } from '@mui/icons-material'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <ChevronRight className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <ChevronRight className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)
const HorizontalMenu = ({ dictionary }: { dictionary: Dictionary }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered'
            ? 'var(--mui-palette-background-paper)'
            : 'var(--mui-palette-background-default)',
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }: { level?: number }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(settings, theme)}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }: { level?: number }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0,
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }: { open?: boolean }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme),
        }}
      >
        <SubMenu
          label={dictionary['navigation']?.dashboards}
          icon={<i className='tabler-smart-home' />}
        >
          <MenuItem icon={<i className='tabler-chart-pie-2' />}>
            {dictionary['navigation']?.crm}
          </MenuItem>
          <MenuItem icon={<i className='tabler-trending-up' />}>
            {dictionary['navigation']?.analytics}
          </MenuItem>
          <MenuItem icon={<i className='tabler-shopping-cart' />}>
            {dictionary['navigation']?.eCommerce}
          </MenuItem>
        </SubMenu>
        <SubMenu label={dictionary['navigation']?.apps} icon={<i className='tabler-mail' />}>
          <MenuItem icon={<i className='tabler-calendar' />}>
            {dictionary['navigation']?.calendar}
          </MenuItem>
          <SubMenu
            label={dictionary['navigation']?.invoice}
            icon={<i className='tabler-file-description' />}
          >
            <MenuItem>{dictionary['navigation']?.list}</MenuItem>
            <MenuItem>{dictionary['navigation']?.preview}</MenuItem>
            <MenuItem>{dictionary['navigation']?.edit}</MenuItem>
            <MenuItem>{dictionary['navigation']?.add}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation']?.user} icon={<i className='tabler-user' />}>
            <MenuItem>{dictionary['navigation']?.list}</MenuItem>
            <MenuItem>{dictionary['navigation']?.view}</MenuItem>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation']?.rolesPermissions}
            icon={<i className='tabler-lock' />}
          >
            <MenuItem>{dictionary['navigation']?.roles}</MenuItem>
            <MenuItem>{dictionary['navigation']?.permissions}</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu label={dictionary['navigation']?.pages} icon={<i className='tabler-file' />}>
          <MenuItem icon={<i className='tabler-user-circle' />}>
            {dictionary['navigation']?.userProfile}
          </MenuItem>
          <MenuItem icon={<i className='tabler-settings' />}>
            {dictionary['navigation']?.accountSettings}
          </MenuItem>
          <MenuItem icon={<i className='tabler-help-circle' />}>
            {dictionary['navigation']?.faq}
          </MenuItem>
          <MenuItem icon={<i className='tabler-currency-dollar' />}>
            {dictionary['navigation']?.pricing}
          </MenuItem>
          <SubMenu
            label={dictionary['navigation']?.miscellaneous}
            icon={<i className='tabler-file-info' />}
          >
            <MenuItem target='_blank'>{dictionary['navigation']?.comingSoon}</MenuItem>
            <MenuItem target='_blank'>{dictionary['navigation']?.underMaintenance}</MenuItem>
            <MenuItem target='_blank'>{dictionary['navigation']?.pageNotFound404}</MenuItem>
            <MenuItem target='_blank'>{dictionary['navigation']?.notAuthorized401}</MenuItem>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation']?.authPages}
            icon={<i className='tabler-shield-lock' />}
          >
            <SubMenu label={dictionary['navigation']?.login}>
              <MenuItem>{dictionary['navigation']?.loginV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.loginV2}</MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation']?.register}>
              <MenuItem>{dictionary['navigation']?.registerV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.registerV2}</MenuItem>
              <MenuItem>{dictionary['navigation']?.registerMultiSteps}</MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation']?.verifyEmail}>
              <MenuItem>{dictionary['navigation']?.verifyEmailV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.verifyEmailV2}</MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation']?.forgotPassword}>
              <MenuItem>{dictionary['navigation']?.forgotPasswordV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.forgotPasswordV2}</MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation']?.resetPassword}>
              <MenuItem>{dictionary['navigation']?.resetPasswordV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.resetPasswordV2}</MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation']?.twoSteps}>
              <MenuItem>{dictionary['navigation']?.twoStepsV1}</MenuItem>
              <MenuItem>{dictionary['navigation']?.twoStepsV2}</MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation']?.wizardExamples}
            icon={<i className='tabler-dots' />}
          >
            <MenuItem>{dictionary['navigation']?.checkout}</MenuItem>
            <MenuItem>{dictionary['navigation']?.propertyListing}</MenuItem>
            <MenuItem>{dictionary['navigation']?.createDeal}</MenuItem>
          </SubMenu>
          <MenuItem icon={<i className='tabler-square' />}>
            {dictionary['navigation']?.dialogExamples}
          </MenuItem>
          <SubMenu
            label={dictionary['navigation']?.widgetExamples}
            icon={<i className='tabler-chart-bar' />}
          >
            <MenuItem>{dictionary['navigation']?.basic}</MenuItem>
            <MenuItem>{dictionary['navigation']?.advanced}</MenuItem>
            <MenuItem>{dictionary['navigation']?.statistics}</MenuItem>
            <MenuItem>{dictionary['navigation']?.charts}</MenuItem>
            <MenuItem>{dictionary['navigation']?.actions}</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu
          label={dictionary['navigation']?.formsAndTables}
          icon={<i className='tabler-file-invoice' />}
        >
          <MenuItem icon={<i className='tabler-layout' />}>
            {dictionary['navigation']?.formLayouts}
          </MenuItem>
          <MenuItem icon={<i className='tabler-checkup-list' />}>
            {dictionary['navigation']?.formValidation}
          </MenuItem>
          <MenuItem icon={<i className='tabler-git-merge' />}>
            {dictionary['navigation']?.formWizard}
          </MenuItem>
          <MenuItem icon={<i className='tabler-table' />}>
            {dictionary['navigation']?.reactTable}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-checkbox' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation']?.formELements}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-layout-board-split' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation']?.muiTables}
          </MenuItem>
        </SubMenu>
        <SubMenu
          label={dictionary['navigation']?.charts}
          icon={<i className='tabler-chart-donut-2' />}
        >
          <MenuItem icon={<i className='tabler-chart-ppf' />}>
            {dictionary['navigation']?.apex}
          </MenuItem>
          <MenuItem icon={<i className='tabler-chart-sankey' />}>
            {dictionary['navigation']?.recharts}
          </MenuItem>
        </SubMenu>
        <SubMenu label={dictionary['navigation']?.others} icon={<i className='tabler-dots' />}>
          <MenuItem
            icon={<i className='tabler-cards' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation']?.foundation}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-atom' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation']?.components}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-list-search' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {dictionary['navigation']?.menuExamples}
          </MenuItem>
          <MenuItem
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href='https://pixinvent.ticksy.com'
            icon={<i className='tabler-lifebuoy' />}
          >
            {dictionary['navigation']?.raiseSupport}
          </MenuItem>
          <MenuItem
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            icon={<i className='tabler-book-2' />}
            href='https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
          >
            {dictionary['navigation']?.documentation}
          </MenuItem>
          <MenuItem
            suffix={<CustomChip label='New' size='small' color='info' round='true' />}
            icon={<i className='tabler-notification' />}
          >
            {dictionary['navigation']?.itemWithBadge}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-link' />}
            href='https://pixinvent.com'
            target='_blank'
            suffix={<i className='tabler-external-link text-xl' />}
          >
            {dictionary['navigation']?.externalLink}
          </MenuItem>
          <SubMenu
            label={dictionary['navigation']?.menuLevels}
            icon={<i className='tabler-menu-2' />}
          >
            <MenuItem>{dictionary['navigation']?.menuLevel2}</MenuItem>
            <SubMenu label={dictionary['navigation']?.menuLevel2}>
              <MenuItem>{dictionary['navigation']?.menuLevel3}</MenuItem>
              <MenuItem>{dictionary['navigation']?.menuLevel3}</MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem disabled>{dictionary['navigation']?.disabledMenu}</MenuItem>
        </SubMenu>
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
