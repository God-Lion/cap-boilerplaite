import TableView from '@mui/icons-material/TableView'
import People from '@mui/icons-material/People'
import Class from '@mui/icons-material/Class'
import ControlPointDuplicate from '@mui/icons-material/ControlPointDuplicate'
import Merge from '@mui/icons-material/Merge'
import { Roles } from '@cap/platform-core'

type IMenu = {
  name: string
  icon: React.JSX.Element
  link?: string
  menu?: Array<IMenu>
}

const black = '#FFFFFF' // '#000000'

const userMenu = (roleId: number) => {
  const colorIcon = black
  const styleIcon = {
    color: colorIcon,
  }
  const classes = <Class style={styleIcon} />
  const controlPointDuplicate = <ControlPointDuplicate style={styleIcon} />
  const merge = <Merge style={styleIcon} />
  // const vaccines = <Vaccines style={styleIcon} />
  const tableView = <TableView style={styleIcon} />
  // const dashboard = <Dashboard style={styleIcon} />
  const people = <People style={styleIcon} />

  const menuAdmin: Array<IMenu> = [
    // {
    //   name: `Tableau de bord`,
    //   icon: dashboard,
    //   link: 'admin/Dashboard',
    // },
    {
      name: `participant`,
      icon: people,
      link: `admin/participant`,
    },
    // {
    //   name: `Concours dessin`,
    //   icon: people,
    //   link: `admin/drawingcontest`,
    // },
    // {
    //   name: `Utilsateurs`,
    //   icon: people,
    //   link: 'admin/users',
    // },
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
    // case 1:
    //   return menuSuperAdmin

    // case 3:
    //   return menuSuperVisor
    // case 4:
    //   return menuJudge
    default:
      return []
  }
}
export default userMenu
