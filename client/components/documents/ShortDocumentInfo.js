import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'react-mdl/lib/Icon';
import Tooltip from 'react-mdl/lib/Tooltip';
import dateTimeLocaleString from 'app/utils/dateTimeLocaleString';
import fullName from 'app/utils/fullName';

const iconInfo = {
  public: {
    tooltip: 'Visible to everyone',
    icon: 'public',
  },
  authenticated: {
    tooltip: 'Visible to logged in users only',
    icon: 'group',
  },
  private: {
    tooltip: 'Visible to you only',
    icon: 'lock',
  },
};

const getIcon = access => {
  const { tooltip, icon } = iconInfo[access];
  return (
    <Tooltip label={tooltip} style={{ position: 'absolute', right: '16px' }}>
      <Icon name={icon} />
    </Tooltip>
  );
};

const ShortDocumentInfo = props => (
  <div className={props.className}>
    <div style={{ marginRight: '48px' }}>
    {props.owner
      ?
      <Link to={`/users/${props.owner._id}`}>
        {`${fullName(props.owner.name)}`}
      </Link>
      : '[deleted]'
      } - {dateTimeLocaleString(props.createdAt)}
    </div>
    {getIcon(props.access.read)}
  </div>
);

ShortDocumentInfo.propTypes = {
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.object,
  }),
  access: PropTypes.shape({
    read: PropTypes.string,
    write: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default ShortDocumentInfo;
