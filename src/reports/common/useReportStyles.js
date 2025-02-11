import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  containerMap: {
    flexBasis: '40%',
  },
  containerActivity: {
    flexBasis: '40%',
    width: '100%',
    flexShrink: 0,
  },
  containerActivityLeft: {
    flexBasis: '40%',
    width: '50%',
    height: '100%',
    float: 'left',
  },
  containerActivityRight: {
    flexBasis: '40%',
    width: '50%',
    height: '100%',
    float: 'right',
  },
  containerActivityLeftHead: {
    width: '50%',
    float: 'left',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  containerActivityRightHead: {
    width: '50%',
    float: 'right',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  containerActivityHead: {
    width: '33%',
    float: 'left',
    textAlign: 'center',
    fontSize: '1.1em',
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
  },
  filter: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 2, 2),
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
}));
