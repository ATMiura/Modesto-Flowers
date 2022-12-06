import './fonts.scss'
import './typography.scss'
import './button.scss'
import './styles.scss'

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
const modules = requireAll(require.context("./components", false, /.scss$/));
