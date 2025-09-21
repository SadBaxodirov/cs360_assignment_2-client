import React, {useEffect, useState} from "react";
import {
    getTranscripts,
    addTranscript,
    getTranscript,
    getStudentIds,
    deleteTranscript,
    addGrade,
    getGrade,
} from "../dataService.js";
import "./App.css";

type Transcript = {
    student: { studentID: number; studentName: string };
    grades?: { [course: string]: number };
};

export default function App() {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newStudentName, setNewStudentName] = useState("");

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [singleTranscript, setSingleTranscript] = useState<Transcript | null>(
        null
    );

    const [searchName, setSearchName] = useState("");
    const [foundIds, setFoundIds] = useState<number[]>([]);

    const [courseName, setCourseName] = useState<string>("");
    const [grade, setGrade] = useState<number | null>(null);
    const [foundGrade, setFoundGrade] = useState<number | null>(null);

    useEffect(() => {
        refreshTranscripts();
    }, []);

    async function refreshTranscripts() {
        try {
            setLoading(true);
            const data = await getTranscripts();
            setTranscripts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch transcripts", err);
            setError("Failed to fetch transcripts");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddTranscript() {
        if (!newStudentName.trim()) return;
        try {
            await addTranscript({name: newStudentName});
            setNewStudentName("");
            await refreshTranscripts();
        } catch (err) {
            setError("Could not add transcript");
        }
    }

    async function handleDeleteTranscript(id: number) {
        try {
            await deleteTranscript(id);
            await refreshTranscripts();
        } catch (err) {
            setError("Could not delete transcript");
        }
    }

    async function handleFetchTranscript(id: number) {
        try {
            const data = await getTranscript(id);
            setSingleTranscript(data);
        } catch (err) {
            setError("Could not fetch transcript");
        }
    }

    async function handleSearchByName() {
        try {
            const result = await getStudentIds(searchName);
            setFoundIds(Array.isArray(result) ? result : []);
        } catch (err) {
            setError("Could not search by name");
        }
    }

    async function handleAddGrade() {
        if (selectedId == null || !courseName || grade == null) return;
        try {
            await addGrade(selectedId, courseName, {grade});
            await refreshTranscripts();
        } catch (err) {
            setError("Could not add grade");
        }
    }

    async function handleGetGrade() {
        if (selectedId == null) return;
        try {
            const result = await getGrade(selectedId, 0);
            setFoundGrade(result?.grade ?? null);
        } catch (err) {
            setError("Could not get grade");
        }
    }

    return (
        <div className="container">
            <h1>Transcript Manager</h1>

            {error && <p className="error">{error}</p>}
            {loading ? (
                <p>Loading transcripts...</p>
            ) : (
                <>
                    {/* Add transcript */}
                    <div className="form">
                        <h2>Add Transcript</h2>
                        <input
                            type="text"
                            placeholder="Student name"
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                        />
                        <button onClick={handleAddTranscript}>Add</button>
                    </div>

                    {/* Search by name */}
                    <div className="form">
                        <h2>Search Student IDs by Name</h2>
                        <input
                            type="text"
                            placeholder="Search name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <button onClick={handleSearchByName}>Search</button>
                        {foundIds.length > 0 && (
                            <p>
                                Found IDs: {foundIds.map((s) => s).join(", ")}
                            </p>
                        )}

                    </div>

                    {/* All transcripts */}
                    <h2>All Transcripts</h2>
                    <ul className="list">
                        {transcripts.map((t) => (
                            <li key={t.student.studentID} className="list-item">
                                <span>
                                    {t.student.studentName} (ID:{" "}
                                    {t.student.studentID})
                                </span>
                                <button
                                    onClick={() =>
                                        handleDeleteTranscript(t.student.studentID)
                                    }
                                >
                                    ❌ Delete
                                </button>
                                <button
                                    onClick={() =>
                                        handleFetchTranscript(t.student.studentID)
                                    }
                                >
                                    📄 View
                                </button>
                                <button
                                    onClick={() =>
                                        setSelectedId(t.student.studentID)
                                    }
                                >
                                    ➕ Add Grade
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Single transcript view */}
                    {singleTranscript && (
                        <div className="box">
                            <h3>
                                Transcript for {singleTranscript.student.studentName}
                            </h3>

                            {singleTranscript.grades && singleTranscript.grades.length > 0 ? (
                                <ul>
                                    {singleTranscript.grades.map((g, index) => (
                                        <li key={index}>
                                            {g.course}: {g.grade}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No grades yet</p>
                            )}
                        </div>
                    )}


                    {/* Grade adding / fetching */}
                    {selectedId && (
                        <div className="box">
                            <h3>Add or Get Grade for Student #{selectedId}</h3>
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Grade"
                                value={grade ?? ""}
                                onChange={(e) => setGrade(Number(e.target.value))}
                            />
                            <div>
                                <button onClick={handleAddGrade}>Add Grade</button>
                                <button onClick={handleGetGrade}>Get Grade</button>
                            </div>
                            {foundGrade !== null && (
                                <p>Current grade: {foundGrade}</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
