import withDesktop from '../comp/withdesktop';
import Desktop from './desktop/MainPage/mainWrapper';
import Mobile from './home/Home';

export default withDesktop(Desktop, Mobile);
