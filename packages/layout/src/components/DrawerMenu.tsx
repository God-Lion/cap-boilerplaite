import { useTheme } from '@mui/material/styles'
import TableView from '@mui/icons-material/TableView'
import People from '@mui/icons-material/People'
import Class from '@mui/icons-material/Class'
import ControlPointDuplicate from '@mui/icons-material/ControlPointDuplicate'
import Merge from '@mui/icons-material/Merge'
import { Roles } from '@cap/platform-core'

export type IMenu = {
  name: string
  icon: React.JSX.Element
  link?: string
  menu?: Array<IMenu>
}

export const useUserMenu = (roleId: any) => {
  const theme = useTheme()
  const colorIcon = theme.palette.text.primary
  const styleIcon = {
    color: colorIcon,
  }
  const classes = <Class style={styleIcon} />
  const controlPointDuplicate = <ControlPointDuplicate style={styleIcon} />
  const merge = <Merge style={styleIcon} />
  const tableView = <TableView style={styleIcon} />
  const people = <People style={styleIcon} />

  const menuAdmin: Array<IMenu> = [
    {
      name: `participant`,
      icon: people,
      link: `admin/participant`,
    },
    {
      name: 'Table de reference',
      icon: tableView,
      menu: [
        {
          name: `Category`,
          icon: classes,
          link: `admin/category`,
        },
        {
          name: `Eddition`,
          icon: controlPointDuplicate,
          link: `admin/eddition`,
        },
        {
          name: `Phase`,
          icon: merge,
          link: `admin/phase`,
        },
      ],
    },
  ]

  switch (roleId) {
    case Roles.PROVIDERADMIN:
      return menuAdmin
    default:
      return []
  }
}

export default useUserMenu
