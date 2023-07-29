import React, { useEffect, useState } from 'react';
import './AvailableArticles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import useUserRole from '../../hooks/useUserRole';
import downloadIcon from '../../../src/assets/download-icon.png';
import {
  Document,
  PDFDownloadLink,
  Page,
  Text,
  Font
} from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
});

const AvailableArticles = () => {
  const [menuscripts, setMenuscripts] = useState([]);
  const [user] = useAuthState(auth);
  const [userRole] = useUserRole(user?.email);

  useEffect(() => {
    const authorLink = `http://localhost:5000/authorArticles?authorEmail=${user?.email}`;
    const editorLink =
      'https://final-project-server-k11k.onrender.com/articles';
    fetch(userRole === 'author' ? authorLink : editorLink)
      .then((res) => res.json())
      .then((data) => setMenuscripts(data));
  }, [user, userRole]);

  const styles = {
    subInfoTitle: {
      paddingLeft: '15px'
    },
    page: {
      margin: '96px',
      fontSize: '12px'
    }
  };

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Menuscripts</h2>
      <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
        <table className='table text-center'>
          {/* head */}
          <thead className='bg-gray-200 text-slate-900'>
            <tr>
              <th className='w-'>Paper ID</th>
              <th className='w-[10%]'>Co-Author</th>
              <th>Title</th>
              <th className='w-[20%]'>Submission Date</th>
              <th className='w-[10%]'>Paper Status</th>
              <th className='w-[15%]'>Decision</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {menuscripts?.toReversed().map((menuscript, index) => (
              <tr key={index}>
                <td className='flex gap-2 justify-center'>
                  <span>{menuscript?.menuscriptId}</span>
                  <PDFDownloadLink
                    document={
                      <Document>
                        <Page style={styles.page}>
                          <Text>Title: {menuscript.title}</Text> <br />
                          <Text>Abstract: {menuscript.abstract}</Text> <br />
                          <Text>Keywords: {menuscript.keywords}</Text>
                          <Text>Description: {menuscript.description}</Text>
                          <Text>Author Info: </Text> <br />
                          <Text style={styles.subInfoTitle}>
                            First Name: {menuscript.authorInfo.firstName}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Last Name: {menuscript.authorInfo.lastName}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Email: {menuscript.authorEmail}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Country: {menuscript.authorInfo.country}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Department: {menuscript.authorInfo.department}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Institute: {menuscript.authorInfo.institute}
                          </Text>
                          <Text>Author Role: {menuscript.authorRole}</Text>
                          <Text>Author Sequence: </Text> <br />
                          <Text style={styles.subInfoTitle}>
                            Author 1: {menuscript.authorSequence.authorInfo1}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Author 2: {menuscript.authorSequence.authorInfo2}
                          </Text>
                          <Text style={styles.subInfoTitle}>
                            Author 3: {menuscript.authorSequence.authorInfo3}
                          </Text>
                          <Text>
                            Funding Source: {menuscript.fundingSource}
                          </Text>
                        </Page>
                      </Document>
                    }
                    fileName={`${menuscript.title}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        'Loading document...'
                      ) : (
                        <button>
                          <img
                            src={downloadIcon}
                            alt='Download Icon'
                            className='w-5'
                          />
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                </td>
                <td>
                  {menuscript?.authorSequence?.authorInfo1},{' '}
                  {menuscript?.authorSequence?.authorInfo2},{' '}
                  {menuscript?.authorSequence?.authorInfo3}
                </td>
                <td>{menuscript?.title}</td>
                <td>{menuscript?.dateTime}</td>
                <td>pending</td>
                <td>{menuscript?.decision}-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableArticles;
