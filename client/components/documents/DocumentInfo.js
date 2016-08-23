import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import dateTimeLocaleString from 'app/utils/dateTimeLocaleString';
import fullName from 'app/utils/fullName';

const DocumentInfo = props => (
  <div>
    <div className="doc-owner-and-date">
      {'Created by '}
      <strong>
        {props.owner
          ?
          <Link to={`/users/${props.owner._id}`}>
            {`${fullName(props.owner.name)}`}
          </Link>
          :
          '[deleted]'
        }
      </strong>
      {' at '}
      <strong>{`${dateTimeLocaleString(props.createdAt)}`}</strong>
      {props.createdAt !== props.updatedAt &&
        <span>
          {'; edited '}
          <strong>{`${dateTimeLocaleString(props.updatedAt)} `}</strong>
        </span>
      }
    </div>
    <div style={{ paddingTop: '0.5em' }} className="doc-access-details">
      {'Visible to '}
      <strong>
        {props.access.read === 'public' && 'Public'}
        {props.access.read === 'authenticated' && 'Logged In Users'}
        {props.access.read === 'private' && 'Owner'}
      </strong>
      {'; Editable by '}
      <strong>
        {props.access.write === 'authenticated' && 'Logged In Users'}
        {props.access.write === 'private' && 'Owner'}
      </strong>
    </div>
  </div>
);

DocumentInfo.propTypes = {
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
};

export default DocumentInfo;
