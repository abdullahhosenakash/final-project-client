import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import useUserRole from '../../hooks/useUserRole';
import { Link, useNavigate } from 'react-router-dom';
import {
  Document,
  PDFDownloadLink,
  Page,
  Text,
  Font,
  StyleSheet
} from '@react-pdf/renderer';
import Loading from '../Utilities/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import Manuscript from '../Manuscript/Manuscript';
import { signOut } from 'firebase/auth';
import UpdateProfile from '../Utilities/UpdateProfile';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
});

const ManuscriptsAsReviewer = () => {
  UpdateProfile();
  const [manuscripts, setManuscripts] = useState([]);
  const [user] = useAuthState(auth);
  const [userRole] = useUserRole(user?.email);
  const [manuscriptLoading, setManuscriptLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setManuscriptLoading(true);
    fetch(
      `https://final-project-server-liard.vercel.app/manuscriptsAsReviewer?reviewerEmail=${user?.email}`,
      {
        method: 'get',
        headers: {
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('accessToken');
          signOut(auth);
          navigate('/unauthorizedAccess', { replace: true });
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setManuscripts(data);
        setManuscriptLoading(false);
      });
  }, [user, userRole, isModified, navigate]);

  const styles = StyleSheet.create({
    subInfoTitle: {
      paddingLeft: '15px'
    },
    page: {
      margin: '96px',
      fontSize: '12px'
    },
    table: {
      display: 'flex',
      flexDirection: 'row',
      gap: -2
    },
    tableCellHeading: {
      border: '1px solid black',
      padding: '5px',
      textAlign: 'center',
      textDecoration: 'underline'
    },
    tableCellData: {
      border: '1px solid black',
      padding: '5px',
      textAlign: 'center'
    }
  });

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Manuscripts</h2>
      {userRole ? (
        <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
          <table className='table text-center'>
            {/* head */}
            <thead className='bg-gray-200 text-slate-900'>
              <tr className='items-center'>
                <th>Paper ID</th>
                <th>Title</th>
                <th>Submission Date</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {manuscriptLoading ? (
                <tr>
                  <td colSpan={7}>
                    <Loading loadingStyles='loading-lg' />
                  </td>
                </tr>
              ) : manuscripts.length ? (
                manuscripts?.toReversed()?.map((manuscript, index) => (
                  <tr key={index}>
                    <td>
                      <div className='flex gap-2 justify-center items-stretch'>
                        <span>{manuscript?.manuscriptId}</span>
                        <PDFDownloadLink
                          document={
                            <Document>
                              <Page style={styles.page}>
                                <Text>Title: {manuscript.title}</Text>
                                <Text>Abstract: {manuscript.abstract}</Text>
                                <Text>Keywords: {manuscript.keywords}</Text>
                                <Text>
                                  Description: {manuscript.description}
                                </Text>
                              </Page>
                            </Document>
                          }
                          fileName={`Manuscript_${manuscript.manuscriptId}.pdf`}
                        >
                          {({ loading }) =>
                            loading ? (
                              <Loading />
                            ) : (
                              <button>
                                <FontAwesomeIcon
                                  icon={faFileArrowDown}
                                  className='text-lg transition-transform hover:scale-110'
                                />
                              </button>
                            )
                          }
                        </PDFDownloadLink>
                      </div>
                    </td>
                    {userRole === 'author' ? (
                      <td>
                        {manuscript?.authorInfo?.firstName +
                          ' ' +
                          manuscript?.authorInfo?.lastName}
                        ,
                        {manuscript?.authorSequence?.map((author, index) => (
                          <span key={index}>
                            {author.authorName}
                            {index + 1 === manuscript?.authorSequence?.length
                              ? ''
                              : ', '}
                          </span>
                        ))}
                      </td>
                    ) : (
                      ''
                    )}
                    <td>
                      <button
                        className='hover:underline hover:text-blue-700 hover:cursor-pointer'
                        onClick={() => {
                          setSelectedManuscript(manuscript);
                          document.getElementById('my_modal_1').showModal();
                        }}
                      >
                        {manuscript?.title}
                      </button>
                      <Manuscript
                        selectedManuscript={selectedManuscript}
                        isModified={isModified}
                        setIsModified={setIsModified}
                      />
                    </td>
                    <td>{manuscript?.forwardingDateTime}</td>
                    <td>
                      {manuscript?.reviewers?.find(
                        (reviewer) => reviewer.reviewerEmail === user?.email
                      )?.reviewerDecision || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className='text-center text-xl hover:bg-gray-100'
                  >
                    No manuscript available!{' '}
                    {userRole === 'author' ? (
                      <Link
                        to='/newManuscript'
                        className='text-blue-600 hover:underline'
                      >
                        Click to add now
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading loadingStyles='loading-lg mt-3 block mx-auto' />
      )}
    </div>
  );
};

export default ManuscriptsAsReviewer;
