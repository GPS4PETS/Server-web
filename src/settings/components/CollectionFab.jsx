import { Fab } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAdministrator } from '../../common/util/permissions';

const useStyles = makeStyles()((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.dimensions.bottomBarHeight}px + ${theme.spacing(2)})`,
    },
    transform: 'translateY(-20px)',
  },
}));

const CollectionFab = ({ editPath, disabled }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const admin = useAdministrator();

  if (admin && !disabled) {
    return (
      <div className={classes.fab}>
        <Fab size="medium" color="primary" onClick={() => navigate(editPath)}>
          <AddIcon />
        </Fab>
      </div>
    );
  }
  return '';
};

export default CollectionFab;
