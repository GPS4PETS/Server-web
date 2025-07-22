import { makeStyles } from 'tss-react/mui';

export default makeStyles()((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  containerMap: {
    flexBasis: '40%',
  },
  containerMap2: {
    flexBasis: '50%',
  },
  containerMap3: {
    flexBasis: '70%',
  },
  containerActivity: {
    flexBasis: '20%',
    width: '100%',
    height: '30%',
    flexShrink: 0,
  },
  containerActivityOverview: {
    flexBasis: '40%',
    width: '100%',
    height: '40%',
    flexShrink: 0,
  },
  containerActivity2: {
    flexBasis: '40%',
    width: '50%',
    height: '100%',
    float: 'left',
  },
  containerActivityHead2: {
    width: '50%',
    float: 'left',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  containerActivityHead3: {
    width: '33%',
    float: 'left',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  containerActivity3: {
    width: '33%',
    float: 'left',
    textAlign: 'center',
  },
  containerFilter: {
    flexShrink: 0,
  },
  containerMain: {
    overflow: 'auto',
  },
  header: {
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  columnAction: {
    width: '1%',
    paddingLeft: theme.spacing(1),
    '@media print': {
      display: 'none',
    },
  },
  filter: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 2, 2),
    '@media print': {
      display: 'none !important',
    },
  },
  filterItem: {
    minWidth: 0,
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButton: {
    flexGrow: 1,
  },
  chart: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  header2: {
    padding: '10px',
    fontSize: '1.1em',
    backgroundColor: '#EEEEEE10',
  },
  actionCellPadding: {
    '&.MuiTableCell-body': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '@media print': {
      display: 'none',
    },
  },
}));
